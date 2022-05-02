import * as React from 'react';
import {
    enable as enableDarkMode,
    disable as disableDarkMode,
} from 'darkreader';
import styled, { ThemeProvider } from 'styled-components';
import Font from '../components/common/Font';
import Footer from '../components/footer';
import Header from '../components/header';
import GlobalStyle from '../theme/Global';
import theme from '../theme/theme';
import { ToastContainer } from 'react-toastify';

import { injectStyle } from 'react-toastify/dist/inject-style';

if (window !== undefined) {
    injectStyle();
}

const Template = ({
    title,
    children,
}: Readonly<{
    title: string;
    children: React.ReactNode;
}>) => {
    const [state, setState] = React.useState({
        isDarkMode: false,
    });

    const { isDarkMode } = state;

    React.useEffect(() => {
        !isDarkMode
            ? disableDarkMode()
            : enableDarkMode({
                  brightness: 100,
                  contrast: 90,
                  sepia: 10,
              });
    }, [isDarkMode]);

    return (
        <ThemeProvider theme={theme}>
            <Container>
                <ToastContainer />
                <GlobalStyle />
                <Font fontFamily={theme.fontFamily} />
                <title>{title}</title>
                <Header
                    isDarkMode={isDarkMode}
                    setIsDarkMode={() =>
                        setState((prev) => ({
                            ...prev,
                            isDarkMode: !prev.isDarkMode,
                        }))
                    }
                />
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
