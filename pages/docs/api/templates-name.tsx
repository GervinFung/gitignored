import React from 'react';

import {
	Box,
	Divider,
	Flex,
	Heading,
	ListItem,
	Text,
	UnorderedList,
} from '@chakra-ui/react';

import SyntaxHighlighter from 'react-syntax-highlighter';

import * as Hljs from 'react-syntax-highlighter/dist/cjs/styles/hljs';

import { Optional } from '@poolofdeath20/util';

import Documentation from '../../../src/web/components/docs';
import { ErrorNote } from '../../../src/web/components/doc/api';
import Seo from '../../../src/web/components/seo';

const GenerateTemplatesName = () => {
	return (
		<Documentation title="API Generate Templates Name">
			<Seo
				title={Optional.some('API Docs | Generate Templates Name')}
				description={Optional.some(
					'This section explains the API endpoint for generating .gitignore templates name, and its response structure with an example'
				)}
				keywords={['documentation', 'api', 'generate templates name']}
			/>
			<Flex flexDirection="column" gridGap={8}>
				<Flex direction="column" gridGap={4}>
					<Box>
						<Heading as="h1" size="4xl">
							Templates Name
						</Heading>
						<Divider mt={2} mb={1} />
					</Box>
					<Box>
						<Text>
							Found at{' '}
							<strong>
								gitignored.vercel.app/api/v0/templates-name
							</strong>
						</Text>
					</Box>
				</Flex>
				<Flex direction="column" gridGap={4}>
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
							) that includes a comprehensive list of all
							available template names. This can be helpful for
							users who are unfamiliar with the names of each
							template, as they can match the template name and
							search for the corresponding template using its name
							as an ID
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
										language="javascript"
										style={Hljs.nightOwl}
										customStyle={{ padding: '16px' }}
									>
										{JSON.stringify(
											{
												status: 'succeed',
												data: {
													template: {
														names: [
															'Dart',
															'C',
															'Laravel',
														],
													},
												},
											},
											undefined,
											4
										)}
									</SyntaxHighlighter>
								</Box>
								<Box
									py={4}
									px={4}
									boxSizing="border-box"
									backgroundColor="gray.200"
								>
									<blockquote>
										<strong>NOTE:</strong> The above list is
										not exhaustive and there are additional
										templates available
									</blockquote>
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

export default GenerateTemplatesName;
