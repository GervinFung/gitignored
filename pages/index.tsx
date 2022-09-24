import type { NextPage } from 'next';
import * as React from 'react';
import Layout from '../src/web/App';
import Body from '../src/web/components/body';

const IndexPage: NextPage = () => (
    <Layout title="Home">
        <Body />
    </Layout>
);

export default IndexPage;
