import * as React from 'react';
import styled from 'styled-components';
import { title } from '../../pages';

const Name = () => (
    <Container>
        <HeaderName>{title}</HeaderName>
    </Container>
);

const Container = styled.div`
    font-family: Bungee;
`;

const HeaderName = styled.h1`
    font-size: 2.5em;
`;

export default Name;
