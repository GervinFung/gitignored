import React from 'react';
import type { AppProps } from 'next/app';
import styled, { ThemeProvider } from 'styled-components';
import theme from '../src/web/theme/theme';
import { ErrorBoundary, Loading } from '../src/web/components/error';
import { ToastContainer } from 'react-toastify';
import '../src/web/css/jetbrains.css';
import '../src/web/css/bungee.css';

const App = ({ Component, pageProps }: AppProps) => (
    <ThemeProvider theme={theme}>
        <EmptyContainer>
            <ToastContainer />
            <ErrorBoundary>
                <React.Suspense fallback={<Loading />}>
                    <Component {...pageProps} />
                </React.Suspense>
            </ErrorBoundary>
        </EmptyContainer>
    </ThemeProvider>
);

const EmptyContainer = styled.main`
    .Toastify__toast-body {
        font-family: ${({ theme }) => theme.fontFamily}, sans-serif !important;
    }
`;

export default App;
