import type { PropsWithChildren } from 'react';

import styled from '@emotion/styled';
import { DefaultSeo } from 'next-seo';
import React from 'react';

import theme from '../../theme';
import Footer from '../footer';
import Header from '../header';

const Layout = (
	props: Readonly<
		PropsWithChildren<{
			title: string;
		}>
	>
) => {
	const dimensions = [48, 72, 96, 144, 192, 256, 384, 512] as const;

	const url = process.env.NEXT_PUBLIC_ORIGIN;

	const description =
		'The Web Application of Gitignored. A more UI/UX Friendly Web Application that generates useful .gitignore files for your project from by choosing different collection of templates stored by Github. Preview/Copy/Download Single or Multiple .gitignore File(s)';

	const gitignoredTitle = `Gitignored | ${props.title}`;

	const iconPath = '/images/icons';

	return (
		<Container>
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
						const icon = {
							href,
							sizes,
							rel: 'icon',
						};
						const appleTouchIcon = {
							href,
							sizes,
							rel: 'apple-touch-icon',
						};
						return [icon, appleTouchIcon];
					}),
				]}
				additionalMetaTags={[
					{
						name: 'keyword',
						content:
							'gitignore files, gitignore templates, gitignored, gitignore, GitHub gitignore, NextJS, git',
					},
					{
						name: 'author',
						content: 'PoolOfDeath20 | Gervin Fung Da Xuen',
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
						content: 'Gitignored',
					},
					{
						name: 'application-mobile-web-app-title',
						content: 'Gitignored',
					},
					{
						name: 'theme-color',
						content: theme.pureWhite,
					},
					{
						name: 'msapplication-navbutton-color',
						content: theme.pureWhite,
					},
					{
						name: 'apple-mobile-web-app-status-bar-style',
						content: theme.pureWhite,
					},
					{
						name: 'msapplication-starturl',
						content: 'index.html',
					},
				]}
				canonical={url}
				defaultTitle={gitignoredTitle}
				description={description}
				openGraph={{
					url,
					description,
					title: gitignoredTitle,
					images: dimensions.map((dimension) => {
						return {
							alt: description,
							width: dimension,
							height: dimension,
							url: `${iconPath}/icon-${dimension}x${dimension}.png`,
						};
					}),
				}}
				title={gitignoredTitle}
				titleTemplate={gitignoredTitle}
				twitter={{
					handle: '@gitignored',
					site: '@gitignored',
					cardType: 'summary_large_image',
				}}
			/>
			<Header />
			{props.children}
			<Footer />
		</Container>
	);
};

const Container = styled.div`
	height: 100vh;
	font-family: ${theme.fontFamily};
	.Toastify__toast-body {
		font-family: ${theme.fontFamily};
	}
	input {
		font-family: ${theme.fontFamily};
	}
`;

export default Layout;
