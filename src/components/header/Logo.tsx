import * as React from 'react';
import { Link } from 'gatsby';
import { StaticImage } from 'gatsby-plugin-image';
import styled from 'styled-components';
import { title } from '../../pages';
import { BungeeFont } from '../common/Font';

const Logo = () => (
    // eslint-disable-next-line
    // @ts-ignore
    <Link to="/">
        <Container>
            <BungeeFont />
            <StaticImage
                src="../../../static/images/git-ignored-logo.webp"
                alt={`Logo of ${title}`}
                width={50}
            />
            {title}
        </Container>
    </Link>
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
