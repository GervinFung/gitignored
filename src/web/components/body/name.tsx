import React from 'react';
import styled from 'styled-components';
import { title } from '../../util';

const Name = () => (
    <div>
        <HeaderName>{title}</HeaderName>
    </div>
);

const HeaderName = styled.h1`
    font-family: Bungee;
    font-size: 2.5em;
`;

export default Name;
