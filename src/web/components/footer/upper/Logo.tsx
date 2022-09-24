import React from 'react';
import Image from 'next/image';
import styled from 'styled-components';
import { title } from '../../../util';
import CustomLink from '../../common/Link';

const Logo = () => (
    <CustomLink
        param={{
            href: '/',
        }}
    >
        <Container>
            <Image
                width={70}
                height={41}
                quality={100}
                alt={`Logo of ${title}`}
                src="/images/icons/logo.webp"
            />
            {title}
        </Container>
    </CustomLink>
);

const Container = styled.div`
    display: flex;
    justify-content: space-between;
    grid-gap: 8px;
    align-items: center;
    font-family: Bungee;
    color: ${({ theme }) => theme.pureWhite};
`;

export default Logo;
