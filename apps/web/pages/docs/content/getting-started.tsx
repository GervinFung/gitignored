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
import { Optional } from '@poolofdeath20/util';
import React from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { nightOwl } from 'react-syntax-highlighter/dist/cjs/styles/hljs';

import InternalLink from '../../../src/web/components/common/link';
import Documentation from '../../../src/web/components/docs';
import Seo from '../../../src/web/components/seo';

const GettingStarted = () => {
	return (
		<Documentation title="Getting Started">
			<Seo
				description={Optional.some(
					'This section briefly explains usage of Gitignored, via web browser, PWA, and terminal'
				)}
				keywords={['documentation', 'introduction']}
				title={Optional.some('Docs Getting Started')}
				url="/docs/client/getting-started"
			/>
			<Flex flexDirection="column" gridGap={8}>
				<Flex direction="column" gridGap={4}>
					<Box>
						<Heading as="h1" size="4xl">
							Getting Started
						</Heading>
						<Divider mb={1} mt={2} />
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
						<Divider mb={1} mt={2} />
					</Box>
					<Box>
						<OrderedList
							listStylePosition="inside"
							marginInlineStart={0}
						>
							<ListItem>
								<Link
									href={process.env.NEXT_PUBLIC_ORIGIN}
									isExternal
									target="_blank"
									textDecorationLine="underline"
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
						<Divider mb={1} mt={2} />
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
									href="https://doc.rust-lang.org/cargo/getting-started/installation.html"
									isExternal
									rel="external nofollow noopener noreferrer"
									target="_blank"
									textDecorationLine="underline"
								>
									<strong>here</strong>
								</Link>
							</ListItem>
							<ListItem>
								To install the terminal program, simply execute
								the command below
								<Box my={4}>
									<SyntaxHighlighter
										customStyle={{ padding: '16px' }}
										language="rust"
										style={nightOwl}
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
										customStyle={{ padding: '16px' }}
										language="rust"
										style={nightOwl}
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
