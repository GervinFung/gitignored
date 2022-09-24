import React from 'react';
import Document, {
    DocumentContext,
    Head,
    Main,
    NextScript,
    Html,
} from 'next/document';
import { ServerStyleSheet } from 'styled-components';

export default class Doc extends Document {
    static getInitialProps = async (documentContext: DocumentContext) => {
        const sheet = new ServerStyleSheet();
        const { renderPage } = documentContext;

        try {
            // Run the React rendering logic synchronously
            documentContext.renderPage = () =>
                renderPage({
                    // Useful for wrapping the whole react tree
                    enhanceApp: (App) => (props) =>
                        sheet.collectStyles(<App {...props} />),
                    // Useful for wrapping in a per-page basis
                    enhanceComponent: (Component) => Component,
                });
            const initialProps = await Document.getInitialProps(
                documentContext
            );
            return {
                ...initialProps,
                styles: (
                    <>
                        {initialProps.styles}
                        {sheet.getStyleElement()}
                    </>
                ),
            };
        } finally {
            sheet.seal();
        }
    };

    render = () => (
        <Html lang="en">
            <Head />
            <meta charSet="utf-8" />
            <body
                style={{
                    margin: 0,
                    padding: 0,
                    overflowX: 'hidden',
                }}
            >
                <Main />
                <NextScript />
            </body>
        </Html>
    );
}
