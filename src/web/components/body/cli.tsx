import React from 'react';
import styled from 'styled-components';
import { constants } from '../../util';

const Cli = () => (
    <Container>
        <Link
            target="_blank"
            href={constants.cargo}
            rel="external nofollow noopener noreferrer"
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
