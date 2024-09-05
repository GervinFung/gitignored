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
import Image from 'next/image';
import React from 'react';

import InternalLink from '../src/web/components/common/link';
import Layout from '../src/web/components/layout';
import Seo from '../src/web/components/seo';
import { title } from '../src/web/util/const';

const Index = () => {
	return (
		<Layout title="Home">
			<Seo
				description={Optional.none()}
				keywords={['introduction']}
				title={Optional.none()}
				url={undefined}
			/>
			<Container display="grid" maxWidth="100%" placeItems="center">
				<Flex
					alignItems="center"
					boxSizing="border-box"
					flexDirection="column"
					py={16}
					width="80%"
				>
					<Box display="grid" placeItems="center">
						<Image
							alt={`Logo of ${title}`}
							height={88}
							quality={100}
							src="/images/icons/logo.webp"
							style={{
								marginBottom: 24,
							}}
							width={150}
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
							display="grid"
							gridGap={8}
							gridTemplateColumns="1fr 1fr"
							spacing={0}
							variant="outline"
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
												key={link}
												px={9}
												py={6}
												width="100%"
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
