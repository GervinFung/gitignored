import React from 'react';
import styled from 'styled-components';
import { constants } from '../../../util';

const ExternalLinks = () => (
    <Container>
        {(
            [
                {
                    section: 'Report a bug',
                    link: `${constants.repo}/issues`,
                },
                {
                    section: 'How to contribute',
                    link: `${constants.repo}#contribution`,
                },
                {
                    section: 'Command line tool',
                    link: constants.cargo,
                },
                {
                    section: 'Open source project',
                    link: constants.repo,
                },
            ] as const
        ).map(({ section, link }) => (
            <ExternalLink
                key={section}
                href={link}
                target="_blank"
                rel="external nofollow noopener noreferrer"
            >
                {section}
            </ExternalLink>
        ))}
    </Container>
);

const Container = styled.div`
    height: 100%;
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    text-align: right;
    > a {
        text-decoration: none;
        padding: 8px;
        color: ${({ theme }) => theme.pureWhite};
    }
`;

const ExternalLink = styled.a`
    text-decoration: none;
`;

export default ExternalLinks;
