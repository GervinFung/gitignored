import {
    MongoClient,
    WithId,
    Document,
    ObjectId,
    InsertOneResult,
} from 'mongodb';
import {
    GitIgnoreNamesAndIds,
    GitIgnoreSelectedTechs,
    TimeStamps,
} from '../../../../common/type';
import promisifiedGitIgnoreNamesAndContents from '../../scrapper';
import mongodbConfig from './config';

type ReadonlyObjectIds = ReadonlyArray<ObjectId>;

type ReadonlyNameAndId = Readonly<
    WithId<Document> &
        Readonly<{
            name: GitIgnoreSelectedTechs[0]['name'];
        }>
>;

const mongodb = (async () => {
    const client = (() => {
        const createURL = ({
            srv,
            port,
        }: Readonly<{
            srv: string | undefined;
            port: string | undefined;
        }>) => {
            if (srv) {
                return `mongodb${srv}://${user}:${password}@${address}/${dbName}?authSource=admin&retryWrites=true&w=majority`;
            }
            if (port) {
                return `mongodb://${user}:${password}@${address}:${port}/${dbName}?authSource=admin&retryWrites=true&w=majority`;
            }
            throw new Error('Port or SRV are not defined');
        };
        const {
            auth: { user, password },
            dbName,
            port,
            address,
            srv,
        } = mongodbConfig;
        //ref: https://stackoverflow.com/questions/63754742/authentication-failure-while-trying-to-save-to-mongodb/63755470#63755470
        const url = createURL({ srv, port });
        return new MongoClient(url);
    })();

    await client.connect();

    const {
        dbName,
        collections: { timeStamp, tech },
    } = mongodbConfig;
    const database = client.db(dbName);

    const getTechs = () => database.collection(tech);
    const getTimeStamp = () => database.collection(timeStamp);

    const shouldBulkUpsert = async (): Promise<boolean> => {
        if (!(await getTimeStamp().estimatedDocumentCount())) {
            return true;
        }
        const timeStamp = await getTimeStamp().findOne<
            Readonly<{
                updatedAt: string;
            }>
        >({}, { sort: { _id: -1 }, projection: { _id: 0, updatedAt: 1 } });
        if (!timeStamp) {
            throw new Error('TimeStamp cannot be undefined');
        }
        return (
            Math.abs(
                new Date(timeStamp.updatedAt).getTime() - new Date().getTime()
            ) /
                36e5 >=
            24
        );
    };

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

    const insertLatestTimestamp = async (
        timeStamp: TimeStamps[0]
    ): Promise<Readonly<InsertOneResult<Document>>> =>
        await getTimeStamp().insertOne(timeStamp);

    return {
        shouldBulkUpsert,
        bulkUpsertGitIgnoreTemplate,
        insertLatestTimestamp,
        close: async () => await client.close(),
        // testing purpose only
        clearCollections: async () =>
            (await getTechs().deleteMany({})) &&
            (await getTimeStamp().deleteMany({})),
        getAllTechNamesAndIds: async (): Promise<GitIgnoreNamesAndIds> => {
            const techNames = await getTechs()
                .find<ReadonlyNameAndId>(
                    {},
                    { projection: { _id: 1, name: 1 } }
                )
                .toArray();
            return techNames.map(({ _id, name }) => ({
                name,
                id: _id.toHexString(),
            }));
        },
        updateGitIgnoreTemplate: async () => {
            if (!(await shouldBulkUpsert())) {
                return;
            }
            const namesAndContents =
                await promisifiedGitIgnoreNamesAndContents();
            const createdAt = new Date();
            const result = await bulkUpsertGitIgnoreTemplate(namesAndContents);
            if (!result) {
                await insertLatestTimestamp({
                    createdAt,
                    bulkUpsertStatus: 'failed',
                    updatedAt: new Date(),
                });
                throw new Error(
                    `Insertion failed at time created of ${result}`
                );
            }
            await insertLatestTimestamp({
                createdAt,
                bulkUpsertStatus: 'completed',
                updatedAt: new Date(),
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
