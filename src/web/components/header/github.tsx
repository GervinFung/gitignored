import React from 'react';
import styled from 'styled-components';
import { VscGithubInverted } from 'react-icons/vsc';
import { constants } from '../../util';

const GitHubIcon = () => (
    <Container>
        <ExternalLink
            href={constants.repo}
            target="_blank"
            rel="external nofollow noopener noreferrer"
        >
            <GitHubContainer>
                <Github />
            </GitHubContainer>
        </ExternalLink>
    </Container>
);

const Container = styled.div`
    align-items: center;
`;

const GitHubContainer = styled.div`
    display: grid;
    place-items: center;
`;

const ExternalLink = styled.a`
    text-decoration: none;
`;

const Github = styled(VscGithubInverted)`
    font-size: 1.65em;
    color: ${({ theme }) => theme.pureWhite};
`;

export default GitHubIcon;
