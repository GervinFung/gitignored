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
import Image from 'next/image';
import React from 'react';
import { SiGithub } from 'react-icons/si';

import { constants, title } from '../../util/const';
import InternalLink from '../common/link';

const Header = () => {
	return (
		<Box as="section">
			<Box as="nav" bg="bg-surface" borderBottom="1px solid">
				<Container maxWidth="80%" py={4}>
					<HStack display="flex" justify="space-between" spacing={10}>
						<InternalLink
							param={{
								href: '/',
							}}
						>
							<Image
								alt={`Logo of ${title}`}
								height={29}
								quality={100}
								src="/images/icons/logo.webp"
								width={50}
							/>
						</InternalLink>
						<Flex gap={8}>
							<ButtonGroup spacing={4} variant="ghost">
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
									href={constants.repo}
									isExternal
									rel="external nofollow noopener noreferrer"
									target="_blank"
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
