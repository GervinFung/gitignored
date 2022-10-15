import axios from 'axios';
import type { InferGetServerSidePropsType } from 'next';
import React from 'react';
import Layout from '../src/web/App';
import Body from '../src/web/components/body';
import { api, parseAsGitIgnoreTechs } from '../src/web/util';

type ServerProps = InferGetServerSidePropsType<typeof getServerSideProps>;

const getServerSideProps = async () => ({
    props: {
        response: await axios
            .get(`${process.env.ORIGIN}${api.gitIgnored}`)
            .then(
                ({ data }) =>
                    ({
                        status: 'success',
                        gitIgnoreNamesAndIds: parseAsGitIgnoreTechs(
                            data.gitIgnoreNamesAndIds
                        ),
                    } as const)
            )
            .catch(
                (error) =>
                    ({
                        status: 'failed',
                        error: error,
                    } as const)
            ),
    },
});

const IndexPage = (serverProps: ServerProps) => (
    <Layout title="Home">
        <Body serverProps={serverProps} />
    </Layout>
);

export type { ServerProps };

export { getServerSideProps };

export default IndexPage;
