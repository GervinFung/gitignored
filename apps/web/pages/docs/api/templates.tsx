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

const GenerateTemplates = () => {
	return (
		<Documentation title="API Generate Templates">
			<Seo
				description={Optional.some(
					'This section explains the API endpoint for generating .gitignore templates, and its response structure with an example'
				)}
				keywords={['documentation', 'api', 'generate templates']}
				title={Optional.some('API Docs | Generate Templates')}
				url="/docs/api/templates"
			/>
			<Flex flexDirection="column" gridGap={8}>
				<Flex direction="column" gridGap={4}>
					<Box>
						<Heading as="h1" size="4xl">
							Templates
						</Heading>
						<Divider mb={1} mt={2} />
					</Box>
					<Box>
						<Text mb={2}>
							Found at{' '}
							<strong>
								gitignored.vercel.app/api/v0/templates
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
							) that contains a list of templates that can be
							filtered by matching IDs, which in this case refers
							to the name specified. If no filter is applied, the
							API will return all available templates
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
													templates: [
														{
															name: 'Actionscript',
															content: '...',
														},
														{
															name: 'Ada',
															content: '...',
														},
														{
															name: 'Node',
															content: '...',
														},
													],
												},
											},
											undefined,
											4
										)}
									</SyntaxHighlighter>
								</Box>
								<Box
									backgroundColor="gray.200"
									boxSizing="border-box"
									px={4}
									py={4}
								>
									<blockquote>
										<strong>NOTE:</strong> The above list is
										not exhaustive and there are additional
										templates available
									</blockquote>
								</Box>
							</ListItem>
							<ListItem my={2}>
								Failed Response
								<ErrorNote />
							</ListItem>
						</UnorderedList>
					</Box>
					<Box>
						<Heading as="h2" size="lg">
							Queries
						</Heading>
						<Divider mb={1} mt={2} />
					</Box>
					<Box>
						<Text>
							Queries can be utilized to filter the list of
							templates, and IDs can be combined by using a comma
							(&apos;,&apos;).
						</Text>
					</Box>
					<Box>
						<Text>
							For instance, the query{' '}
							<strong>
								gitignored.vercel.app/api/v0/templates?ids=ArchLinuxPackages,Smalltalk,Laravel
							</strong>{' '}
							will return the templates for ArchLinuxPackages,
							Smalltalk and Laravel
						</Text>
					</Box>
					<Box>
						<Text>
							However, if a user misspells an ID, for example
							typing <em>Laraavel</em> instead of{' '}
							<strong>
								<em>Laravel</em>
							</strong>
							, the API will prompt the user to confirm whether
							they intended to search for Laravel. If the user
							denies it, the API will exclude the template for
							Laravel from the response, but will still return the
							templates for ArchLinuxPackages and Smalltalk.
							However, if the user confirms the correction, the
							API will include the Laravel template in the
							response.
						</Text>
					</Box>
				</Flex>
			</Flex>
		</Documentation>
	);
};

export default GenerateTemplates;
