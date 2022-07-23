import { MongoClient, WithId, Document, ObjectId } from 'mongodb';
import {
    UpdateTime,
    GitIgnoreNamesAndIds,
    GitIgnoreSelectedTechs,
} from '../../common/type';
import scrapper from '../../scrapper';
import mongodbConfig from './config';

type ReadonlyObjectIds = ReadonlyArray<ObjectId>;

type ReadonlyNameAndId = Readonly<
    WithId<Document> &
        Readonly<{
            name: GitIgnoreSelectedTechs[0]['name'];
        }>
>;

const mongodb = (async () => {
    const config = mongodbConfig();
    const client = (() => {
        const createURL = () => {
            const {
                auth: { user, password },
                dbName,
                port,
                address,
                srv,
            } = config;
            if (srv) {
                return `mongodb${srv}://${user}:${password}@${address}/${dbName}?authSource=admin&retryWrites=true&w=majority`;
            }
            if (port) {
                return `mongodb://${user}:${password}@${address}:${port}/${dbName}?authSource=admin&retryWrites=true&w=majority`;
            }
            throw new Error('Port or SRV are not defined');
        };
        //ref: https://stackoverflow.com/questions/63754742/authentication-failure-while-trying-to-save-to-mongodb/63755470#63755470
        return new MongoClient(createURL());
    })();

    await client.connect();

    const {
        dbName,
        collections: { tech, updateTime },
    } = config;
    const database = client.db(dbName);

    const getTechs = () => database.collection(tech);
    const getUpdateTime = () => database.collection(updateTime);

    const getLatestTimeCommitted = async () => {
        const latestTimeUpdated = await getUpdateTime().findOne<
            Readonly<{
                commitedAt: string;
            }>
        >({}, { sort: { _id: -1 }, projection: { _id: 0, commitedAt: 1 } });
        if (!latestTimeUpdated) {
            throw new Error('latest time updated cannot be undefined');
        }
        return new Date(latestTimeUpdated.commitedAt);
    };

    const shouldBulkUpsert = async (
        latestTimeCommitted: () => Promise<Date>
    ): Promise<boolean> =>
        !(await getUpdateTime().estimatedDocumentCount())
            ? true
            : (await latestTimeCommitted()).getTime() >
              (await getLatestTimeCommitted()).getTime();

    const bulkUpsertGitIgnoreTemplate = async (
        gitIgnoreNamesAndContents: GitIgnoreSelectedTechs
    ): Promise<
        Readonly<{
            [key: number]: ObjectId;
        }>
    > => {
        if (!gitIgnoreNamesAndContents.length) {
            throw new Error('Scrapped data is empty');
        }
        const techs = getTechs();
        const isDropped = await techs.deleteMany({});
        if (!isDropped) {
            throw new Error('Must drop collection');
        }
        const { acknowledged, insertedIds, insertedCount } =
            await techs.insertMany(Array.from(gitIgnoreNamesAndContents));
        if (
            !(
                acknowledged &&
                insertedCount === gitIgnoreNamesAndContents.length
            )
        ) {
            throw new Error(
                `Faulty insertion, acknowledged: ${acknowledged}, insertedCount: ${insertedCount} and length: ${gitIgnoreNamesAndContents.length}`
            );
        }
        return insertedIds;
    };

    const insertLatestTimeUpdated = async ({
        startedAt,
        commitedAt,
        bulkUpsertStatus,
        endedAt,
    }: Omit<UpdateTime, 'endedAt'> &
        Readonly<{
            endedAt: () => Date;
        }>): Promise<ObjectId> => {
        const { acknowledged, insertedId } = await getUpdateTime().insertOne({
            startedAt,
            commitedAt,
            bulkUpsertStatus,
            endedAt: endedAt(),
        } as UpdateTime);
        if (!acknowledged) {
            throw new Error(`Failed to insert time update of ${updateTime}`);
        }
        return insertedId;
    };

    const getLatestCommitTime = async () => {
        const latestCommitTime = await getUpdateTime().findOne<
            Readonly<{
                commitedAt: string;
                startedAt: string;
            }>
        >(
            {},
            {
                sort: { _id: -1 },
                projection: { _id: 0, commitedAt: 1, createdAt: 1 },
            }
        );
        return !latestCommitTime
            ? await scrapper.getLatestTimeCommitted()
            : Math.abs(
                  new Date(latestCommitTime.startedAt).getTime() -
                      new Date().getTime()
              ) /
                  36e5 >=
              24
            ? await scrapper.getLatestTimeCommitted()
            : new Date(latestCommitTime.commitedAt);
    };

    return {
        shouldBulkUpsert,
        getLatestCommitTime,
        insertLatestTimeUpdated,
        bulkUpsertGitIgnoreTemplate,
        close: () => client.close(),
        // testing purpose only
        clearCollections: async () =>
            (await getTechs().deleteMany({})) &&
            (await getUpdateTime().deleteMany({})),
        getAllTechNamesAndIds: async (): Promise<GitIgnoreNamesAndIds> =>
            (
                await getTechs()
                    .find<ReadonlyNameAndId>(
                        {},
                        { projection: { _id: 1, name: 1 } }
                    )
                    .toArray()
            ).map(({ _id, name }) => ({
                name,
                id: _id.toHexString(),
            })),
        updateGitIgnoreTemplate: async () => {
            if (!(await shouldBulkUpsert(getLatestCommitTime))) {
                return;
            }
            const namesAndContents =
                await scrapper.getGitIgnoreNameAndContents();
            const startedAt = new Date();
            const result = await bulkUpsertGitIgnoreTemplate(namesAndContents);
            const endedAt = () => new Date();
            if (!result) {
                await insertLatestTimeUpdated({
                    startedAt,
                    endedAt,
                    bulkUpsertStatus: 'failed',
                    commitedAt: await getLatestCommitTime(),
                });
                throw new Error(
                    `Insertion failed at time created of ${result}`
                );
            }
            await insertLatestTimeUpdated({
                startedAt,
                endedAt,
                bulkUpsertStatus: 'completed',
                commitedAt: await getLatestCommitTime(),
            });
        },
        //ref: https://www.mongodb.com/docs/manual/reference/operator/#AdvancedQueries-%24in
        getContentAndNameFromSelectedIds: async (
            objectIds: ReadonlyObjectIds
        ): Promise<GitIgnoreSelectedTechs> => {
            if (!objectIds.length) {
                throw new Error('ObjectIds cannot be empty');
            }
            return (
                (await getTechs()
                    .find<
                        Readonly<WithId<Document> & GitIgnoreSelectedTechs[0]>
                    >(
                        { _id: { $in: objectIds } },
                        { projection: { _id: 0, name: 1, content: 1 } }
                    )
                    .toArray()) ?? []
            );
        },
    };
})();

export default mongodb;
