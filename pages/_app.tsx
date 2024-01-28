import React from 'react';

import type { AppProps } from 'next/app';

import { ChakraProvider, extendTheme } from '@chakra-ui/react';

import ErrorBoundary from '../src/web/components/error/boundary';

import trpc from '../src/web/hooks/trpc';

import '../src/web/css/jetbrains.css';
import '../src/web/css/bungee.css';

const App = (props: AppProps) => {
	return (
		<ChakraProvider
			theme={extendTheme({
				fonts: {
					heading: 'Jetbrains Mono',
					body: 'Jetbrains Mono',
				},
				styles: {
					global: {
						body: {
							margin: 0,
							padding: 0,
							overflowX: 'hidden',
							backgroundColor: 'transparent',
							transition: 'all ease-in-out 0.1s',
						},
						html: {
							scrollBehavior: 'smooth',
						},
					},
				},
			})}
		>
			<ErrorBoundary>
				<props.Component {...props.pageProps} />
			</ErrorBoundary>
		</ChakraProvider>
	);
};

export default trpc.withTRPC(App);
