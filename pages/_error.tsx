import React from 'react';

import { useRouter } from 'next/router';

import styled from '@emotion/styled';

import { Box, Heading, useToast } from '@chakra-ui/react';

import Layout from '../src/web/components/layout';

const ErrorPage = () => {
	const [command, setCommand] = React.useState(
		undefined as string | undefined
	);

	const router = useRouter();

	const toast = useToast();

	return (
		<Layout title="404 Error">
			<Box
				minH="100%"
				display="flex"
				flexDirection="column"
				placeItems="center"
				textAlign="center"
			>
				<Heading as="h1" size="4xl" m="50px">
					404
				</Heading>
				<p>
					You did&apos;t break the internet, just that, you manage to
					visit something that don&apos;t exist{' '}
					<span role="img" aria-label="smug">
						😏
					</span>
				</p>
				<p>
					Luckily, there is a fix, just type{' '}
					<GitCommand>git reset --soft HEAD~1</GitCommand> to go back
					to Home page
				</p>
				<Box
					display="flex"
					alignItems="center"
					border="1px solid #333"
					borderRadius="4"
					width="375px"
					padding="8px 16px"
					fontSize="0.85em"
					margin="64px auto 0 auto"
				>
					<Box margin="0 8px 0 0" color="#3757EF">
						<span>gitignored</span>
						<span>@</span>
						<span>developer</span>
						<span>~&gt;</span>
					</Box>
					<GitCommandPrompt
						type="text"
						autoComplete="off"
						autoCorrect="off"
						autoCapitalize="off"
						spellCheck="false"
						onChange={(event) => {
							return setCommand(event.target.value);
						}}
						onKeyDown={(event) => {
							const isEnterKeyClicked =
								event.key === 'Enter' || event.code === '13';

							if (isEnterKeyClicked) {
								if (command === 'git reset --soft HEAD~1') {
									router.replace('/');
								} else {
									toast.promise(
										new Promise((resolve) => {
											setTimeout(resolve, 2000);
										}),
										{
											error: {
												description: `${command}: command not found`,
											},
											loading: {},
											success: {},
										}
									);
								}
							}
						}}
					/>
				</Box>
			</Box>
		</Layout>
	);
};

const GitCommand = styled.code`
	background-color: #ecf1f7;
	color: #182d4c;
	padding: 4px 8px;
	box-sizing: border-box;
	border-radius: 4px;
`;

const GitCommandPrompt = styled.input`
	border: none;
	outline: none;
	width: 100%;
	color: #0c840a;
	background: transparent !important;
`;

export default ErrorPage;
