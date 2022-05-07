import * as React from 'react';
import { Link } from 'gatsby';
import { StaticImage } from 'gatsby-plugin-image';
import styled from 'styled-components';
import { title } from '../../../pages';

const Logo = () => (
    // eslint-disable-next-line
    // @ts-ignore
    <Link to="/">
        <Container>
            <StaticImage
                src="../../../../static/images/git-ignored-logo.webp"
                alt={`Logo of ${title}`}
                quality={95}
                width={70}
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
