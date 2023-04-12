import React from 'react';
import styled, { css } from 'styled-components';
import { SiTypescript, SiNextdotjs, SiMongodb } from 'react-icons/si';

type IconsProps = Readonly<{
    rightMargin: number;
}>;

const TechLogos = () => (
    <Container>
        {[
            {
                link: 'https://www.gatsbyjs.com/',
                component: <Nextjs />,
                rightMargin: 0,
            },
            {
                link: 'https://www.typescriptlang.org/',
                component: <Typescript />,
                rightMargin: 24,
            },
            {
                link: 'https://www.mongodb.com/',
                component: <Mongodb />,
                rightMargin: 24,
            },
        ].map(({ link, component, rightMargin }) => (
            <IconContainer key={link} rightMargin={rightMargin}>
                <a
                    href={link}
                    target="_blank"
                    rel="external nofollow noopener noreferrer"
                >
                    {component}
                </a>
            </IconContainer>
        ))}
    </Container>
);

const Container = styled.div`
    font-size: 1em;
    box-sizing: border-box;
    margin: 0 0 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const IconContainer = styled.div`
    margin: ${({ rightMargin }: IconsProps) => `0 0 0 ${rightMargin}px`};
    > a {
        color: ${({ theme }) => theme.pureWhite};
        text-decoration: none;
    }
`;

const Icon = css`
    font-size: 1.5em;
`;

const Nextjs = styled(SiNextdotjs)`
    ${Icon}
`;

const Typescript = styled(SiTypescript)`
    ${Icon}
`;

const Mongodb = styled(SiMongodb)`
    ${Icon}
`;

export default TechLogos;
