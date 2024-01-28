import React from 'react';

import Image from 'next/image';

import {
	Box,
	Link,
	Button,
	ButtonGroup,
	Container,
	Divider,
	IconButton,
	Stack,
	Text,
	Flex,
} from '@chakra-ui/react';

import {
	SiChakraui,
	SiTypescript,
	SiNextdotjs,
	SiMongodb,
} from 'react-icons/si';

import { constants, title } from '../../util/const';

import InternalLink from '../common/link';
import { Defined } from '@poolofdeath20/util';

const Footer = () => {
	const originYear = 2022;

	const year = new Date().getFullYear();

	return (
		<Flex
			mt={24}
			as="footer"
			maxWidth="100%"
			justifyContent="space-between"
			borderTop="1px solid"
		>
			<Container
				role="contentinfo"
				minWidth="80%"
				display="grid"
				placeItems="center"
			>
				<Stack
					width="100%"
					spacing={8}
					direction="column"
					justify="space-between"
					py={8}
				>
					<Stack
						width="100%"
						display="flex"
						flexDirection="row"
						justifyContent="space-between"
					>
						<Box>
							<InternalLink
								param={{
									href: '/',
								}}
							>
								<Image
									width={120}
									height={70}
									quality={100}
									alt={`Logo of ${title}`}
									src="/images/icons/logo.webp"
								/>
							</InternalLink>
						</Box>
						<Stack direction="row" spacing={8}>
							<Stack spacing={4} minW={36} flex={1}>
								<Stack shouldWrapChildren>
									{[
										{
											section: 'Report a bug',
											link: `${constants.repo}/issues`,
										},
										{
											section: 'How to contribute',
											link: `${constants.repo}#contribution`,
										},
										{
											section: 'Command line tool',
											link: constants.cargo,
										},
										{
											section: 'Open source project',
											link: constants.repo,
										},
									].map(({ section, link }) => {
										return (
											<Link
												key={link}
												isExternal
												href={link}
												target="_blank"
												rel="external nofollow noopener noreferrer"
											>
												<Button
													variant="link"
													color="inherit"
												>
													{section}
												</Button>
											</Link>
										);
									})}
								</Stack>
							</Stack>
						</Stack>
					</Stack>
				</Stack>
				<Divider width="100%" />
				<Stack
					width="100%"
					pb={4}
					justify="space-between"
					flexDirection="row"
					align="center"
				>
					<Text fontSize="1em" color="subtle">
						Copyright &copy;{' '}
						{year === originYear ? year : `${originYear} - ${year}`}
					</Text>
					<ButtonGroup variant="ghost">
						{[
							{
								link: 'https://nextjs.org',
								Component: SiNextdotjs,
							},
							{
								link: 'https://www.typescriptlang.org',
								Component: SiTypescript,
							},
							{
								link: 'https://www.mongodb.com',
								Component: SiMongodb,
							},
							{
								link: 'https://chakra-ui.com',
								Component: SiChakraui,
							},
						].map((props) => {
							return (
								<IconButton
									key={props.link}
									as="a"
									href={props.link}
									aria-label={Defined.parse(
										props.link
											.replace('www', '')
											.replace('.com', '')
											.split('//')
											.at(1)
									)
										.orThrow(
											new Error(
												'There is nothing to show for a name'
											)
										)
										.replace('.', '')}
									icon={<props.Component fontSize="1.5em" />}
								/>
							);
						})}
					</ButtonGroup>
				</Stack>
			</Container>
		</Flex>
	);
};

export default Footer;
