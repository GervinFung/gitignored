import React from 'react';
import styled from 'styled-components';
import { ToastError } from '../toaser/toaser';

const Loading = () => (
    <Container>
        <InnerContainer>
            <LoadingMessage>Loading...</LoadingMessage>
        </InnerContainer>
    </Container>
);

type State = Readonly<{
    hasError: boolean;
}>;

class ErrorBoundary extends React.Component<
    Readonly<{
        children: React.ReactNode;
    }>,
    State
> {
    state: State = {
        hasError: false,
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    static getDerivedStateFromError = (_: Error): State => ({
        hasError: true,
    });

    componentDidCatch = (
        { name, cause, message, stack }: Error,
        { componentStack }: React.ErrorInfo
    ) => {
        console.error({ name, cause, message, stack, componentStack });
        return ToastError(
            <div>
                <code>name: {name}</code>
                <code>cause: {JSON.stringify(cause)}</code>
                <code>message: {message}</code>
                <code>stack: {stack}</code>
                <code>error info: {componentStack}</code>
            </div>
        );
    };

    render = (): JSX.Element | React.ReactNode =>
        !this.state.hasError ? (
            this.props.children
        ) : (
            <Container>
                <InnerContainer>
                    <LoadingMessage>
                        Oops! Seems like there&apos;s a problem loading the
                        content
                    </LoadingMessage>
                    <LoadingMessage>Please try again</LoadingMessage>
                    <LoadingMessage>
                        If you think this is an issue, please file an issue{' '}
                        <IssueLink href="https://github.com/Gitignored-App/web/issues">
                            here
                        </IssueLink>
                    </LoadingMessage>
                </InnerContainer>
            </Container>
        );
}

const Container = styled.div`
    position: fixed;
    width: 100%;
    height: 100%;
    display: grid;
    place-items: center;
    font-family: ${({ theme }) => theme.fontFamily};
`;

const LoadingMessage = styled.p`
    color: ${({ theme }) => theme.black};
    font-size: 35px;
    margin: 0 0 50px 0 !important;
`;

const IssueLink = styled.a.attrs({
    rel: 'noopener noreferrer',
})`
    text-decoration: none;
    color: ${({ theme }) => theme.primaryColor};
`;

const InnerContainer = styled.div`
    display: grid;
    place-items: center;
`;

export { Loading, ErrorBoundary };
