import * as React from 'react';
import styled from 'styled-components';
import { constants } from '../../../util/component-logic/const';

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
            <a
                key={section}
                href={link}
                target="_blank"
                rel="external nofollow noopener noreferrer"
            >
                {section}
            </a>
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

export default ExternalLinks;
