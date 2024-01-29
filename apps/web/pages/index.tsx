import React from 'react';

import Image from 'next/image';
import {
	Text,
	Box,
	Heading,
	Flex,
	Button,
	ButtonGroup,
	Container,
} from '@chakra-ui/react';

import { Optional } from '@poolofdeath20/util';

import InternalLink from '../src/web/components/common/link';
import Layout from '../src/web/components/layout';
import { title } from '../src/web/util/const';
import Seo from '../src/web/components/seo';

const Index = () => {
	return (
		<Layout title="Home">
			<Seo
				title={Optional.none()}
				description={Optional.none()}
				keywords={['introduction']}
			/>
			<Container maxWidth="100%" display="grid" placeItems="center">
				<Flex
					py={16}
					width="80%"
					boxSizing="border-box"
					flexDirection="column"
					alignItems="center"
				>
					<Box display="grid" placeItems="center">
						<Image
							width={150}
							height={88}
							quality={100}
							alt={`Logo of ${title}`}
							src="/images/icons/logo.webp"
							style={{
								marginBottom: 24,
							}}
						/>
						<Heading as="h1" fontFamily="Bungee" size="2xl">
							{title}
						</Heading>
					</Box>
					<Box my={16} textAlign="center">
						<Text mb={8}>
							Have you ever wonder what&apos;s the most commonly
							used <code>.gitignore</code> template?
						</Text>
						<Text mb={8}>
							Are you unsure of what should be ignored by git?
						</Text>
						<Text>
							<b>Say no more!</b>
						</Text>
					</Box>
					<Box>
						<ButtonGroup
							spacing={0}
							variant="outline"
							display="grid"
							gridTemplateColumns="1fr 1fr"
							gridGap={8}
						>
							{(['Documentation', 'Templates'] as const).map(
								(link) => {
									return (
										<InternalLink
											key={link}
											param={{
												href:
													link === 'Documentation'
														? 'docs'
														: link.toLowerCase(),
											}}
										>
											<Button
												py={6}
												px={9}
												width="100%"
												key={link}
											>
												{link}
											</Button>
										</InternalLink>
									);
								}
							)}
						</ButtonGroup>
					</Box>
				</Flex>
			</Container>
		</Layout>
	);
};

export default Index;
