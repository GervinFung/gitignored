import {
	Box,
	Divider,
	Flex,
	Heading,
	ListItem,
	Text,
	UnorderedList,
} from '@chakra-ui/react';
import { Optional } from '@poolofdeath20/util';
import React from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { nightOwl } from 'react-syntax-highlighter/dist/cjs/styles/hljs';

import { ErrorNote } from '../../../src/web/components/doc/api';
import Documentation from '../../../src/web/components/docs';
import Seo from '../../../src/web/components/seo';

const CommitTime = () => {
	return (
		<Documentation title="API Commit Time">
			<Seo
				description={Optional.some(
					'This section explains the API endpoint for retrieving the latest updated time of the templates, and its response structure with an example'
				)}
				keywords={['documentation', 'api', 'commit', 'time']}
				title={Optional.some('API Docs | Commit Time')}
				url="/docs/api/commit-time"
			/>
			<Flex flexDirection="column" gridGap={8}>
				<Flex direction="column" gridGap={4}>
					<Box>
						<Heading as="h1" size="4xl">
							Commit Time
						</Heading>
						<Divider mb={1} mt={2} />
					</Box>
					<Box>
						<Text>
							Found at{' '}
							<strong>
								gitignored.vercel.app/api/v0/commit-time
							</strong>
						</Text>
					</Box>
				</Flex>
				<Flex direction="column" gridGap={8}>
					<Box>
						<Text>
							Returns either an error message (
							<strong>
								<em>failed response</em>
							</strong>
							) as string or an object (
							<strong>
								<em>successful response</em>
							</strong>
							) that contains the latest updated time, which
							serves as an indicator for determining whether to
							pull new templates. This feature helps to avoid the
							need to pull the templates every time a user needs
							to access them
						</Text>
					</Box>
					<Box>
						<UnorderedList
							listStylePosition="inside"
							marginInlineStart={0}
							spacing={8}
						>
							<ListItem>
								Successful Response
								<Box my={4}>
									<SyntaxHighlighter
										customStyle={{ padding: '16px' }}
										language="javascript"
										style={nightOwl}
									>
										{JSON.stringify(
											{
												status: 'succeed',
												data: {
													latestCommittedTime:
														new Date(2022, 4, 8),
												},
											},
											undefined,
											4
										)}
									</SyntaxHighlighter>
								</Box>
							</ListItem>
							<ListItem>
								Failed Response
								<ErrorNote />
							</ListItem>
						</UnorderedList>
					</Box>
				</Flex>
			</Flex>
		</Documentation>
	);
};

export default CommitTime;
