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
import Image from 'next/image';
import React from 'react';
import {
	SiChakraui,
	SiTypescript,
	SiNextdotjs,
	SiSupabase,
} from 'react-icons/si';

import { constants, title } from '../../util/const';
import InternalLink from '../common/link';

const Footer = () => {
	const year = {
		origin: 2022,
		current: new Date().getFullYear(),
	};

	return (
		<Flex
			as="footer"
			borderTop="1px solid"
			justifyContent="space-between"
			maxWidth="100%"
			mt={24}
		>
			<Container
				display="grid"
				minWidth="80%"
				placeItems="center"
				role="contentinfo"
			>
				<Stack
					direction="column"
					justify="space-between"
					py={8}
					spacing={8}
					width="100%"
				>
					<Stack
						display="flex"
						flexDirection="row"
						justifyContent="space-between"
						width="100%"
					>
						<Box>
							<InternalLink
								param={{
									href: '/',
								}}
							>
								<Image
									alt={`Logo of ${title}`}
									height={70}
									quality={100}
									src="/images/icons/logo.webp"
									width={120}
								/>
							</InternalLink>
						</Box>
						<Stack direction="row" spacing={8}>
							<Stack flex={1} minW={36} spacing={4}>
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
												href={link}
												isExternal
												key={link}
												rel="external nofollow noopener noreferrer"
												target="_blank"
											>
												<Button
													color="inherit"
													variant="link"
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
					align="center"
					flexDirection="row"
					justify="space-between"
					py={8}
					width="100%"
				>
					<Text color="subtle" fontSize="1em">
						Copyright &copy; {`${year.origin} - ${year.current}`}
					</Text>
					<ButtonGroup variant="ghost">
						{[
							{
								link: 'nextjs.org',
								Component: SiNextdotjs,
							},
							{
								link: 'www.typescriptlang.org',
								Component: SiTypescript,
							},
							{
								link: 'www.supabase.com',
								Component: SiSupabase,
							},
							{
								link: 'chakra-ui.com',
								Component: SiChakraui,
							},
						].map((props) => {
							return (
								<IconButton
									aria-label={props.link
										.replace('www', '')
										.replace('.com', '')
										.replace('.', '')}
									as="a"
									href={`https://${props.link}`}
									icon={<props.Component fontSize="1.5em" />}
									key={props.link}
									rel="external nofollow noopener noreferrer"
									target="_blank"
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
