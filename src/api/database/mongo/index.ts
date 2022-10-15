import { MongoClient, WithId, Document, ObjectId, Db } from 'mongodb';
import type {
    GitIgnoreSelectedTechs,
    GitIgnoreNamesAndIds,
    GitIgnoreNamesAndContents,
    UpdateTime,
} from '../../../common/type';
import scrapper from '../../scrapper';
import mongodbConfig from './config';

class Database {
    private readonly database: Db;
    private readonly tech: string;
    private readonly updateTime: string;
    private readonly scrapper: ReturnType<typeof scrapper>;

    private static readonly create = async () => {
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
        return new Database(client, config);
    };

    static readonly mongodb: Promise<Database> = Database.create();

    private constructor(
        private readonly client: MongoClient,
        config: ReturnType<typeof mongodbConfig>
    ) {
        const {
            dbName,
            collections: { tech, updateTime },
        } = config;
        this.tech = tech;
        this.updateTime = updateTime;
        this.database = client.db(dbName);
        this.scrapper = scrapper();
    }

    private readonly getTechs = () => this.database.collection(this.tech);

    private readonly getUpdateTime = () =>
        this.database.collection(this.updateTime);

    private readonly getLatestTimeCommitted = async () => {
        const latestTimeUpdated = await this.getUpdateTime().findOne<
            Readonly<{
                commitedAt: string;
            }>
        >({}, { sort: { _id: -1 }, projection: { _id: 0, commitedAt: 1 } });
        if (!latestTimeUpdated) {
            throw new Error('latest time updated cannot be undefined');
        }
        return new Date(latestTimeUpdated.commitedAt);
    };

    // testing purpose only
    readonly close = () => this.client.close();
    readonly clearCollections = async () =>
        (await this.getTechs().deleteMany({})) &&
        (await this.getUpdateTime().deleteMany({}));

    readonly bulkUpsertGitIgnoreTemplate = async (
        gitIgnoreNamesAndContents: GitIgnoreSelectedTechs
    ): Promise<
        Readonly<{
            [key: number]: ObjectId;
        }>
    > => {
        if (!gitIgnoreNamesAndContents.length) {
            throw new Error('Scrapped data is empty');
        }
        const techs = this.getTechs();
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

    getLatestCommitTime = async () => {
        const latestCommitTime = await this.getUpdateTime().findOne<
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
            ? await this.scrapper.getLatestTimeCommitted()
            : Math.abs(
                  new Date(latestCommitTime.startedAt).getTime() -
                      new Date().getTime()
              ) /
                  36e5 >=
              24
            ? await this.scrapper.getLatestTimeCommitted()
            : new Date(latestCommitTime.commitedAt);
    };

    shouldBulkUpsert = async (
        latestTimeCommitted: () => Promise<Date>
    ): Promise<boolean> =>
        !(await this.getUpdateTime().estimatedDocumentCount())
            ? true
            : (await latestTimeCommitted()).getTime() >
              (await this.getLatestTimeCommitted()).getTime();

    getAllTechNamesAndIds = async (): Promise<GitIgnoreNamesAndIds> =>
        (
            await this.getTechs()
                .find<
                    Readonly<
                        WithId<Document> &
                            Readonly<{
                                name: GitIgnoreSelectedTechs[0]['name'];
                            }>
                    >
                >({}, { projection: { _id: 1, name: 1 } })
                .toArray()
        ).map(({ _id, name }) => ({
            name,
            id: _id.toHexString(),
        }));

    getAllTechNamesAndContents = async (): Promise<GitIgnoreNamesAndContents> =>
        await this.getTechs()
            .find<
                Readonly<
                    Readonly<{
                        name: GitIgnoreSelectedTechs[0]['name'];
                        content: GitIgnoreSelectedTechs[0]['content'];
                    }>
                >
            >({}, { projection: { _id: 0, name: 1, content: 1 } })
            .toArray();

    insertLatestTimeUpdated = async ({
        startedAt,
        commitedAt,
        bulkUpsertStatus,
        endedAt,
    }: Omit<UpdateTime, 'endedAt'> &
        Readonly<{
            endedAt: () => Date;
        }>): Promise<ObjectId> => {
        const { acknowledged, insertedId } =
            await this.getUpdateTime().insertOne({
                startedAt,
                commitedAt,
                bulkUpsertStatus,
                endedAt: endedAt(),
            } as UpdateTime);
        if (!acknowledged) {
            throw new Error(`Failed to insert time update of ${commitedAt}`);
        }
        return insertedId;
    };

    updateGitIgnoreTemplate = async () => {
        if (!(await this.shouldBulkUpsert(this.getLatestCommitTime))) {
            return;
        }
        const namesAndContents =
            await this.scrapper.getGitIgnoreNameAndContents();
        const startedAt = new Date();
        const result = await this.bulkUpsertGitIgnoreTemplate(namesAndContents);
        const endedAt = () => new Date();
        if (!result) {
            await this.insertLatestTimeUpdated({
                startedAt,
                endedAt,
                bulkUpsertStatus: 'failed',
                commitedAt: await this.getLatestCommitTime(),
            });
            throw new Error(`Insertion failed at time created of ${result}`);
        }
        await this.insertLatestTimeUpdated({
            startedAt,
            endedAt,
            bulkUpsertStatus: 'completed',
            commitedAt: await this.getLatestCommitTime(),
        });
    };
    //ref: https://www.mongodb.com/docs/manual/reference/operator/#AdvancedQueries-%24in
    getContentAndNameFromSelectedIds = async (
        objectIds: ReadonlyArray<ObjectId>
    ): Promise<GitIgnoreSelectedTechs> => {
        if (!objectIds.length) {
            throw new Error('ObjectIds cannot be empty');
        }
        return (
            (await this.getTechs()
                .find<Readonly<WithId<Document> & GitIgnoreSelectedTechs[0]>>(
                    { _id: { $in: objectIds } },
                    { projection: { _id: 0, name: 1, content: 1 } }
                )
                .toArray()) ?? []
        );
    };
}

export default Database;
