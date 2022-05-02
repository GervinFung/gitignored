import * as React from 'react';
import styled from 'styled-components';
import { repo } from '../../../util/component-logic/const';

const ExternalLinks = () => (
    <Container>
        {(
            [
                {
                    section: 'Report a bug',
                    to: '/issues',
                },
                {
                    section: 'How to contribute',
                    to: '#contribution',
                },
                {
                    section: 'Open source project',
                    to: undefined,
                },
            ] as const
        ).map(({ section, to }) => (
            <a
                key={section}
                href={`${repo}${to ?? ''}`}
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
