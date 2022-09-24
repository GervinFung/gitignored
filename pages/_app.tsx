import React from 'react';
import type { AppProps } from 'next/app';
import { ThemeProvider } from 'styled-components';
import theme from '../src/web/theme/theme';
import { ErrorBoundary, Loading } from '../src/web/components/error';
import Font from '../src/web/components/common/Font';
import { ToastContainer } from 'react-toastify';

const App = ({ Component, pageProps }: AppProps) => (
    <ThemeProvider theme={theme}>
        <ToastContainer />
        <Font fontFamily={theme.fontFamily} />
        <ErrorBoundary>
            <React.Suspense fallback={<Loading />}>
                <Component {...pageProps} />
            </React.Suspense>
        </ErrorBoundary>
    </ThemeProvider>
);

export default App;
