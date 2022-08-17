import * as React from 'react';
import styled from 'styled-components';
import { constants } from '../../util/component-logic/const';

const Cli = () => (
    <Container>
        <Link
            target="_blank"
            rel="external nofollow noopener noreferrer"
            href={constants.cargo}
        >
            Command Line Tool
        </Link>
    </Container>
);

const Link = styled.a`
    font-size: 1em;
    text-decoration: none;
    color: #204ecf;
`;

const Container = styled.div`
    text-align: center;
    padding: 0 0 24px 0;
`;

export default Cli;
