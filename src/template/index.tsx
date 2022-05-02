import * as React from 'react';
import styled, { ThemeProvider } from 'styled-components';
import Font from '../components/common/Font';
import Footer from '../components/footer';
import Header from '../components/header';
import GlobalStyle from '../theme/Global';
import theme from '../theme/theme';
import { ToastContainer } from 'react-toastify';

import { injectStyle } from 'react-toastify/dist/inject-style';

const Template = ({
    title,
    children,
}: Readonly<{
    title: string;
    children: React.ReactNode;
}>) => {
    React.useEffect(() => {
        if (window !== undefined) {
            injectStyle();
        }
    }, []);

    return (
        <ThemeProvider theme={theme}>
            <Container>
                <ToastContainer />
                <GlobalStyle />
                <Font fontFamily={theme.fontFamily} />
                <title>{title}</title>
                <Header />
                {children}
                <Footer />
            </Container>
        </ThemeProvider>
    );
};

const Container = styled.div`
    height: 100vh;
    font-family: ${({ theme }) => theme.fontFamily};
    input {
        font-family: ${({ theme }) => theme.fontFamily};
    }
`;

export default Template;
