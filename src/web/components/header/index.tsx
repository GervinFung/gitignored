import React from 'react';

import Image from 'next/image';

import {
	Link,
	Box,
	Button,
	ButtonGroup,
	Container,
	IconButton,
	Flex,
	HStack,
} from '@chakra-ui/react';

import { SiGithub } from 'react-icons/si';

import InternalLink from '../common/link';

import { constants, title } from '../../util/const';

const Header = () => {
	return (
		<Box as="section">
			<Box as="nav" bg="bg-surface" borderBottom="1px solid">
				<Container py={4} maxWidth="80%">
					<HStack spacing={10} display="flex" justify="space-between">
						<InternalLink
							param={{
								href: '/',
							}}
						>
							<Image
								width={50}
								height={29}
								quality={100}
								alt={`Logo of ${title}`}
								src="/images/icons/logo.webp"
							/>
						</InternalLink>
						<Flex gap={8}>
							<ButtonGroup variant="ghost" spacing={4}>
								{(
									[
										'Home',
										'Documentation',
										'Templates',
									] as const
								).map((link) => {
									return (
										<InternalLink
											key={link}
											param={{
												href: `/${
													link === 'Home'
														? ''
														: link ===
															  'Documentation'
															? 'docs'
															: link.toLowerCase()
												}`,
											}}
										>
											<Button key={link}>{link}</Button>
										</InternalLink>
									);
								})}
								<Link
									isExternal
									href={constants.repo}
									target="_blank"
									rel="external nofollow noopener noreferrer"
								>
									<IconButton
										aria-label="Github"
										icon={
											<SiGithub
												fontSize="1.65em"
												textDecoration="none"
											/>
										}
									/>
								</Link>
							</ButtonGroup>
						</Flex>
					</HStack>
				</Container>
			</Box>
		</Box>
	);
};

export default Header;
