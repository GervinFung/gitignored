import * as React from 'react';
import styled from 'styled-components';
import ExternalLinks from './ExternaLinks';
import Logo from './Logo';

const Upper = () => (
    <Container>
        <Logo />
        <ExternalLinks />
    </Container>
);

const Container = styled.div`
    height: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: ${({ theme }) => theme.pureWhite};
    > a {
        text-decoration: none;
    }
`;

export default Upper;
