import React from 'react';

import {
	Box,
	Button,
	Divider,
	Flex,
	Heading,
	Link,
	ListItem,
	Text,
	UnorderedList,
} from '@chakra-ui/react';

import SyntaxHighlighter from 'react-syntax-highlighter';

import * as Hljs from 'react-syntax-highlighter/dist/cjs/styles/hljs';

import { Optional } from '@poolofdeath20/util';

import Documentation, { docs } from '../../../src/web/components/docs';

import InternalLink from '../../../src/web/components/common/link';

import { changeWordToUrl } from '../../../src/web/util/url';
import Seo from '../../../src/web/components/seo';

const Introduction = () => {
	return (
		<Documentation title="API Introduction">
			<Seo
				url="/docs/api/introduction"
				title={Optional.some('API Docs | Introduction')}
				description={Optional.some(
					'This section briefly introduces the all of the APIs of Gitignored along with its usage and public API design philosophy, which is inspired by Result API of Rust'
				)}
				keywords={['documentation', 'api usage', 'api phyilosphy']}
			/>
			<Flex flexDirection="column" gridGap={8}>
				<Flex direction="column" gridGap={4}>
					<Box>
						<Heading as="h1" size="4xl">
							About
						</Heading>
						<Divider mt={2} mb={1} />
					</Box>
					<Text>
						The Gitignored API provides a platform for developers to
						retrieve valuable information pertaining to the
						supported templates
					</Text>
				</Flex>
				<Flex direction="column" gridGap={4}>
					<Box>
						<Heading as="h2" size="lg">
							Usage
						</Heading>
						<Divider mt={2} mb={1} />
					</Box>
					<Box>
						<Text>
							The URL to access the Gitignroed API can be found at
						</Text>
						<strong>gitignored.vercel.app/api/v0</strong>
					</Box>
					<Box>
						<Text>
							Some routes may include additional queries in the
							URL to filter responses appropriately
						</Text>
					</Box>
					<Box>
						<Text>For instance, by accessing the URL</Text>
						<strong>
							gitignored.vercel.app/api/v0/templates/ids=Laravel,Android
						</strong>
						<Text>
							the API will return the corresponding templates for
							Laravel and Android based on the specified IDs
						</Text>
					</Box>
					<Box
						py={4}
						px={4}
						boxSizing="border-box"
						backgroundColor="gray.200"
					>
						<blockquote>
							<strong>NOTE:</strong> Users who are currently
							accessing the API using the non-semantic versioned
							endpoint &quot;/api&quot; are encouraged to update
							their code to use the current versioned endpoint,
							&quot;/api/v0&quot;
						</blockquote>
					</Box>
				</Flex>
				<Flex direction="column" gridGap={4}>
					<Box>
						<Heading as="h2" size="lg">
							Contents
						</Heading>
						<Divider mt={2} mb={1} />
					</Box>
					<UnorderedList width="max-content">
						{docs.api.items.map((item) => {
							return item === 'Introduction' ? null : (
								<ListItem key={item} mb={4}>
									<InternalLink
										param={{
											href: `/docs/api/${changeWordToUrl(
												item
											)}`,
										}}
									>
										<Button
											p={0}
											variant="link"
											color="inherit"
										>
											{item}
										</Button>
									</InternalLink>
								</ListItem>
							);
						})}
					</UnorderedList>
				</Flex>
				<Flex direction="column" gridGap={4}>
					<Box>
						<Heading as="h2" size="lg">
							Phyilosphy
						</Heading>
						<Divider mt={2} mb={1} />
					</Box>
					<Box>
						<Text>
							The API response is structured in accordance with
							Tagged Union, or Discriminated Union. For more
							information on Tagged/Discriminated Union, please
							refer to{' '}
							<Link
								href="https://en.wikipedia.org/wiki/Tagged_union"
								textDecoration="underline"
								fontWeight="bold"
							>
								this
							</Link>{' '}
							link
						</Text>
					</Box>
					<Box>
						<Text>
							The subsequent presentation illustrates a standard
							response to enhance comprehension
						</Text>
					</Box>
					<Box>
						<SyntaxHighlighter
							language="typescript"
							style={Hljs.nightOwl}
							customStyle={{ padding: '16px' }}
						>
							{[
								'type Response<T> = {',
								"    status: 'succeed'",
								'    data: T',
								'} | {',
								"    status: 'failed'",
								'    reason: string',
								'}',
							].join('\n')}
						</SyntaxHighlighter>
					</Box>
					<Box>
						<Text>
							This design enables developers to parse responses
							effortlessly, eliminating the need to handle either
							a plain object denoting success or a string
							indicating failure
						</Text>
					</Box>
					<Box>
						<Text>
							By affirming the <strong>status</strong> field
							within the response, one can definitively ascertain
							the success or failure of the response.
							Specifically, a &quot;succeed&quot; value indicates
							a successful response with a generic value of T,
							where T is contingent upon the field returned by the
							API. Conversely, a &quot;failed&quot; value
							signifies an unsuccessful response, accompanied by a
							reason to elucidate the failure or simply an error
							message
						</Text>
					</Box>
				</Flex>
			</Flex>
		</Documentation>
	);
};

export default Introduction;
