import * as React from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import { Helmet } from 'react-helmet';

const Seo = ({
    description,
    meta,
    title,
}: Readonly<{
    description?: string;
    title?: string;
    meta?: ReadonlyArray<
        Readonly<{
            name: string;
            content: string;
        }>
    >;
}>) => {
    const {
        site: { siteMetadata },
    } = useStaticQuery(
        graphql`
            query {
                site {
                    siteMetadata {
                        title
                        description
                        author
                        keywords
                        image
                    }
                }
            }
        `
    );

    const { image, keywords } = siteMetadata;
    const metaDescription = description || siteMetadata.description;
    const defaultTitle = title ?? siteMetadata.title;

    return (
        <Helmet
            htmlAttributes={{
                lang: 'en',
            }}
            title={title}
            titleTemplate={
                defaultTitle ? `GitIgnored | ${defaultTitle}` : undefined
            }
            meta={[
                {
                    name: 'description',
                    content: metaDescription,
                },
                {
                    name: 'keywords',
                    content: keywords,
                },
                {
                    property: 'og:title',
                    content: title,
                },
                {
                    property: 'og:description',
                    content: metaDescription,
                },
                {
                    property: 'og:type',
                    content: `website`,
                },
                {
                    property: 'og:image',
                    content: image,
                },
                {
                    name: 'twitter:card',
                    content: `summary`,
                },
                {
                    name: 'twitter:image',
                    content: image,
                },
                {
                    name: 'twitter:creator',
                    content: siteMetadata.author,
                },
                {
                    name: 'twitter:title',
                    content: title,
                },
                {
                    name: 'twitter:description',
                    content: metaDescription,
                },
            ].concat(meta ?? [])}
        />
    );
};

export default Seo;
