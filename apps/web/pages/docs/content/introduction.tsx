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

import { Optional } from '@poolofdeath20/util';

import Documentation from '../../../src/web/components/docs';
import Seo from '../../../src/web/components/seo';

const Introduction = () => {
	return (
		<Documentation title="Introduction">
			<Seo
				url="/docs/content/introduction"
				title={Optional.some('Docs Introduction')}
				description={Optional.some(
					'This section briefly introduces Gitignored and its advantages and disadvantages'
				)}
				keywords={['documentation', 'introduction']}
			/>
			<Flex flexDirection="column" gridGap={8}>
				<Flex direction="column" gridGap={4}>
					<Box>
						<Heading as="h1" size="4xl">
							Gitignored
						</Heading>
						<Divider mt={2} mb={1} />
					</Box>
					<Text>
						A convenient tool for creating .gitignore templates
						tailored to your operating system, programming language,
						or IDE. It provides a user-friendly interface and a
						command line interface for generating .gitignore
						templates for Git repositories
					</Text>
				</Flex>
				<Flex direction="column" gridGap={4}>
					<Box>
						<Heading as="h2" size="lg">
							Advantages
						</Heading>
						<Divider mt={2} mb={1} />
					</Box>
					<Box>
						<UnorderedList spacing={8}>
							<ListItem>
								<Text>
									<strong>Up-to-date templates</strong>. This
									project sources its .gitignore templates
									directly from Github, ensuring that users
									have access to the latest and most
									up-to-date versions of the templates
								</Text>
							</ListItem>
							<ListItem>
								<Text>
									<strong>Support for Terminal</strong>.
									Terminal or Command-Line Interface (CLI) is
									a fundamental tool for developers, and it is
									widely regarded as a universal tool that
									enables developers to efficiently execute
									tasks across various platforms. While
									searching for templates through a web
									browser can be a tedious process, using CLI
									offers a more streamlined and productive
									option. This is because it enables
									developers to quickly access and manipulate
									the destination of selected .gitignore
									templates, with the added advantage of
									maintaining consistent commands across
									different environments
								</Text>
							</ListItem>
							<ListItem>
								<Text>
									<strong>Templates load offline</strong>. In
									addition to the benefits offered by
									Progressive Web Apps (PWAs), there are
									certain circumstances where a strong and
									dependable internet connection may not be
									available, particularly in rural areas with
									poor connectivity. This can create issues
									for users who need to create new projects or
									update .gitignore files. The unavailability
									of online templates can significantly slow
									down their work. Nevertheless, with the
									capability to access templates locally,
									users can continue their work uninterrupted
									regardless of the circumstances
								</Text>
							</ListItem>
						</UnorderedList>
					</Box>
				</Flex>
				<Flex direction="column" gridGap={4}>
					<Box>
						<Heading as="h2" size="lg">
							Disadvantages
						</Heading>
						<Divider mt={2} mb={1} />
					</Box>
					<Box>
						<UnorderedList spacing={8}>
							<ListItem>
								<Text>
									<strong>
										Lag of support for editors/IDEs
									</strong>
									. As of now, the reason for not adding
									another interface for various editors/IDEs
									is because it can be cumbersome and prone to
									bugs, as it requires maintaining multiple
									repositories. Providing support for terminal
									is a better option as it is faster and more
									efficient to use the terminal for
									manipulating the selected .gitignore
									templates than to use editor/IDE specific
									tools
								</Text>
							</ListItem>
						</UnorderedList>
					</Box>
				</Flex>
			</Flex>
		</Documentation>
	);
};

export default Introduction;
