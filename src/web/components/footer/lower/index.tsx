import React from 'react';
import styled from 'styled-components';
import CopyRight from './CopyRight';
import TechLogos from './TechLogos';

const Lower = () => (
    <Container>
        <CopyRight />
        <TechLogos />
    </Container>
);

const Container = styled.div`
    height: 100%;
    display: flex;
    justify-content: space-between;
    color: ${({ theme }) => theme.pureWhite};
    > a {
        text-decoration: none;
    }
`;

export default Lower;
