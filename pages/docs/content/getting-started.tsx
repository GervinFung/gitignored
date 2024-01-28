import React from 'react';

import {
	Box,
	Divider,
	Flex,
	Heading,
	Link,
	ListItem,
	OrderedList,
	Text,
} from '@chakra-ui/react';

import SyntaxHighlighter from 'react-syntax-highlighter';

import * as Hljs from 'react-syntax-highlighter/dist/cjs/styles/hljs';

import { Optional } from '@poolofdeath20/util';

import Documentation from '../../../src/web/components/docs';
import InternalLink from '../../../src/web/components/common/link';
import Seo from '../../../src/web/components/seo';

const GettingStarted = () => {
	return (
		<Documentation title="Getting Started">
			<Seo
				title={Optional.some('Docs Getting Started')}
				description={Optional.some(
					'This section briefly explains usage of Gitignored, via web browser, PWA, and terminal'
				)}
				keywords={['documentation', 'introduction']}
			/>
			<Flex flexDirection="column" gridGap={8}>
				<Flex direction="column" gridGap={4}>
					<Box>
						<Heading as="h1" size="4xl">
							Getting Started
						</Heading>
						<Divider mt={2} mb={1} />
					</Box>
					<Text>
						As previously mentioned in the{' '}
						<strong>
							<InternalLink
								param={{
									href: '/docs',
								}}
							>
								introduction
							</InternalLink>
						</strong>
						, Gitignored offers multiple ways for users to access
						the service, including through a web browser, PWA, and
						terminal. However, as of the time of writing, it should
						be noted that PWA is not currently supported by the
						Firefox Browser
					</Text>
				</Flex>
				<Flex direction="column" gridGap={4}>
					<Box>
						<Heading as="h2" size="lg">
							Browser/PWA
						</Heading>
						<Divider mt={2} mb={1} />
					</Box>
					<Box>
						<OrderedList
							listStylePosition="inside"
							marginInlineStart={0}
						>
							<ListItem>
								<Link
									isExternal
									textDecorationLine="underline"
									href={process.env.NEXT_PUBLIC_ORIGIN}
									target="_blank"
								>
									<strong>This</strong>
								</Link>
								{'  '}application you are using right now
							</ListItem>
						</OrderedList>
					</Box>
				</Flex>
				<Flex direction="column" gridGap={4}>
					<Box>
						<Heading as="h2" size="lg">
							Terminal
						</Heading>
						<Divider mt={2} mb={1} />
					</Box>
					<Flex direction="column" gridGap={4}>
						<Heading as="h3" size="md">
							Installation
						</Heading>
						<OrderedList
							listStylePosition="inside"
							marginInlineStart={0}
						>
							<ListItem>
								Follow the instruction{' '}
								<Link
									isExternal
									textDecorationLine="underline"
									href="https://doc.rust-lang.org/cargo/getting-started/installation.html"
									target="_blank"
									rel="external nofollow noopener noreferrer"
								>
									<strong>here</strong>
								</Link>
							</ListItem>
							<ListItem>
								To install the terminal program, simply execute
								the command below
								<Box my={4}>
									<SyntaxHighlighter
										language="rust"
										style={Hljs.nightOwl}
										customStyle={{ padding: '16px' }}
									>
										cargo install gitignored-cli
									</SyntaxHighlighter>
								</Box>
							</ListItem>
							<ListItem>
								Then run the command below to read
								instructions/usage
								<Box my={4}>
									<SyntaxHighlighter
										language="rust"
										style={Hljs.nightOwl}
										customStyle={{ padding: '16px' }}
									>
										gitignored-cli --help
									</SyntaxHighlighter>
								</Box>
							</ListItem>
						</OrderedList>
					</Flex>
				</Flex>
			</Flex>
		</Documentation>
	);
};

export default GettingStarted;
