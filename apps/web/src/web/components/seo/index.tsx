import type { DeepReadonly, Optional } from '@poolofdeath20/util';

import { DefaultSeo } from 'next-seo';
import React from 'react';

import Schema from './schema';

const Seo = (
	props: DeepReadonly<{
		title: Optional<string>;
		description: Optional<string>;
		keywords: Array<string>;
		url: undefined | string;
	}>
) => {
	const origin = process.env.NEXT_PUBLIC_ORIGIN;

	const url = props.url ? `${origin}/${props.url}` : origin;

	const iconPath = '/images/icons';

	const dimensions = [48, 72, 96, 144, 192, 384, 512] as const;

	const name = 'Gitignored';

	const title = props.title
		.map((title) => {
			return `${name} | ${title}`;
		})
		.unwrapOrGet(name);

	const description = `The Web Application of Gitignored. A more UI/UX Friendly Web Application that generates useful .gitignore files for your project from by choosing different collection of templates stored by Github. Templates can be copied individually or copy all into one template. Templates can also be cownloaded into one zip folder. ${props.description.unwrapOrGet(
		''
	)}`;

	const content = '#FFF';

	return (
		<React.Fragment>
			<Schema />
			<DefaultSeo
				additionalLinkTags={[
					{
						rel: 'icon',
						type: 'image/x-icon',
						href: `${iconPath}/favicon.ico`,
					},
					{
						rel: 'apple-touch-icon',
						type: 'image/x-icon',
						href: `${iconPath}/favicon.ico`,
					},
					...dimensions.flatMap((dimension) => {
						const sizes = `${dimension}x${dimension}`;

						const href = `${iconPath}/icon-${sizes}.png`;

						return [
							{
								href,
								sizes,
								rel: 'icon',
							},
							{
								href,
								sizes,
								rel: 'apple-touch-icon',
							},
						];
					}),
				]}
				additionalMetaTags={[
					{
						name: 'keyword',
						content: `gitignore files, gitignore templates, gitignored, gitignore, ${props.keywords.join()}`,
					},
					{
						name: 'author',
						content: 'Gervin Fung Da Xuen | PoolOfDeath20',
					},
					{
						name: 'viewport',
						content: 'width=device-width, initial-scale=1',
					},
					{
						name: 'mobile-web-app-capable',
						content: 'yes',
					},
					{
						name: 'apple-mobile-web-app-capable',
						content: 'yes',
					},
					{
						name: 'application-name',
						content: name,
					},
					{
						name: 'application-mobile-web-app-title',
						content: name,
					},
					{
						name: 'theme-color',
						content,
					},
					{
						name: 'msapplication-navbutton-color',
						content,
					},
					{
						name: 'apple-mobile-web-app-status-bar-style',
						content,
					},
					{
						name: 'msapplication-starturl',
						content: 'index.html',
					},
				]}
				canonical={url}
				defaultTitle={title}
				description={description}
				openGraph={{
					url,
					title,
					description,
					images: dimensions.map((dimension) => {
						const squareDimension = `${dimension}x${dimension}`;

						return {
							alt: `website icon as dimension of ${squareDimension}`,
							width: dimension,
							height: dimension,
							url: `${iconPath}/icon-${squareDimension}.png`,
						};
					}),
				}}
				title={title}
				titleTemplate={title}
				twitter={{
					handle: `@${name}`,
					site: `@${name}`,
					cardType: 'summary_large_image',
				}}
			/>
		</React.Fragment>
	);
};

export default Seo;
