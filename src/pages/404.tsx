import * as React from 'react';
import Template from '../template';
import styled from 'styled-components';
import { navigate } from 'gatsby';
import { ToastError } from '../components/toaser/Toaser';

const ErrorPage = () => {
    const [state, setState] = React.useState({
        command: undefined as string | undefined,
    });

    const { command } = state;

    const Prompt = () => (
        <GitPrompt>
            <span>gitignored</span>
            <span>@</span>
            <span>developer</span>
            <span>~&gt;</span>
        </GitPrompt>
    );

    return (
        <Template title="404">
            <Container>
                <Title>404</Title>
                <p>
                    You did&apos;t break the internet, just that, you manage to
                    visit something that don&apos;t exist 😏
                </p>
                <p>
                    Luckily, there is a fix, just type{' '}
                    <GitCommand>git reset --soft HEAD~1</GitCommand> to go back
                    to Home page
                </p>
                <GitCommandContainer>
                    <Prompt />
                    <GitCommandPrompt
                        type="text"
                        autoFocus
                        autoComplete="off"
                        autoCorrect="off"
                        autoCapitalize="off"
                        spellCheck="false"
                        onChange={(event) =>
                            setState((prev) => ({
                                ...prev,
                                command: event.target.value,
                            }))
                        }
                        onKeyDown={(event) => {
                            const isEnterKeyClicked =
                                event.key === 'Enter' || event.code === '13';
                            if (isEnterKeyClicked) {
                                if (command === 'git reset --soft HEAD~1') {
                                    navigate('/', {
                                        replace: true,
                                    });
                                } else {
                                    ToastError(
                                        `${command}: command not found`,
                                        { autoClose: 2000 }
                                    );
                                }
                            }
                        }}
                    />
                </GitCommandContainer>
            </Container>
        </Template>
    );
};

const Container = styled.div`
    min-height: 100%;
    display: center;
    place-items: center;
    text-align: center;
`;

const Title = styled.h1`
    font-size: 10em;
    margin: 50px;
`;

const GitCommandContainer = styled.div`
    display: flex;
    margin: 64px auto 0 auto;
    align-items: center;
    border: 1px solid #333;
    border-radius: 4px;
    width: 375px;
    padding: 8px 16px;
    font-size: 0.85em;
`;

const GitCommand = styled.code`
    background-color: #ecf1f7;
    color: #182d4c;
    padding: 4px 8px;
    box-sizing: border-box;
    border-radius: 4px;
`;

const GitPrompt = styled.div`
    margin: 0 8px 0 0;
    color: #3757ef;
`;

const GitCommandPrompt = styled.input`
    border: none;
    outline: none;
    width: 100%;
    color: #0c840a;
    background: transparent !important;
`;

export default ErrorPage;
