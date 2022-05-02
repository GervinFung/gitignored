import * as React from 'react';
import styled from 'styled-components';
import { VscGithubInverted } from 'react-icons/vsc';
import { repo } from '../../util/component-logic/const';

const GitHubIcon = () => (
    <Container>
        <a
            href={repo}
            target="_blank"
            rel="external nofollow noopener noreferrer"
        >
            <GitHubContainer>
                <Github />
            </GitHubContainer>
        </a>
    </Container>
);

const Container = styled.div`
    align-items: center;
`;

const GitHubContainer = styled.div`
    display: grid;
    place-items: center;
`;

const Github = styled(VscGithubInverted)`
    font-size: 1.65em;
    color: ${({ theme }) => theme.pureWhite};
`;

export default GitHubIcon;
