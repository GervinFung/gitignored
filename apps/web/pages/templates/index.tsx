import type { Templates } from '../../src/api/database/persistence/template';
import type { DeepReadonly } from '@poolofdeath20/util';

import {
	Box,
	Button,
	ButtonGroup,
	Container,
	Divider,
	Grid,
	GridItem,
	Skeleton,
	Text,
} from '@chakra-ui/react';
import {
	Optional,
	formQueryParamStringFromRecord,
	Defined,
} from '@poolofdeath20/util';
import { saveAs } from 'file-saver';
import iwanthue from 'iwanthue';
import JSZip from 'jszip';
import { useRouter } from 'next/router';
import React from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { parse, string } from 'valibot';

import 'react-toastify/dist/ReactToastify.css';

import Layout from '../../src/web/components/layout';
import Seo from '../../src/web/components/seo';
import QuerySection from '../../src/web/components/templates/query';
import trpcClient from '../../src/web/proxy/client';
import {
	combineTemplates,
	generateContrastingColor,
} from '../../src/web/util/generator';

type Template = Templates[number];

const useCopyToClipboard = (timeout?: number) => {
	const [copied, setCopied] = React.useState(false);

	React.useEffect(() => {
		if (!copied) {
			return;
		}

		if (!timeout) {
			return setCopied(false);
		}

		const timeOut = setTimeout(() => {
			setCopied(false);
		}, 1000 * 2);

		return () => {
			clearTimeout(timeOut);
		};
	}, [copied, timeout]);

	return {
		copied,
		copy: (text: string) => {
			void navigator.clipboard.writeText(text);
		},
	};
};

const TemplatePreview = (
	props: Readonly<
		{
			backgroundColor: string;
		} & (
			| {
					type: 'ready';
					template: Template;
			  }
			| { type: 'loading'; name: Template['name'] }
		)
	>
) => {
	const clipboard = useCopyToClipboard(2000);

	return (
		<Box
			backgroundColor="gray.100"
			borderRadius={4}
			boxSizing="border-box"
			display="flex"
			flexDirection="column"
			gridGap={4}
			height="100%"
			maxWidth="100%"
			p={4}
			width="100vw"
		>
			<Box
				alignItems="center"
				display="flex"
				justifyContent="space-between"
			>
				<Box
					backgroundColor={props.backgroundColor}
					borderRadius={4}
					boxSizing="border-box"
					color={generateContrastingColor(props.backgroundColor)}
					fontSize="small"
					px={4}
					py={2}
					width="fit-content"
				>
					<Text>
						{props.type === 'loading'
							? props.name
							: props.template.name}
					</Text>
				</Box>
				<Button
					_hover={{
						color: '#FFF',
						backgroundColor: '#282A36',
					}}
					backgroundColor="#282A36"
					borderRadius={4}
					boxSizing="border-box"
					color="#FFF"
					fontSize="small"
					isDisabled={props.type === 'loading'}
					onClick={() => {
						if (props.type === 'loading') {
							throw new Error(`Cannot click when it's loading`);
						}

						clipboard.copy(props.template.content);
					}}
					variant="solid"
				>
					{!clipboard.copied ? 'Copy' : '🎉 Copied'}
				</Button>
			</Box>
			<Box>
				{props.type === 'loading' ? (
					<Skeleton height="450px" minWidth="100%" />
				) : (
					<Text
						fontSize="x-small"
						height="450px"
						overflow="auto"
						whiteSpace="pre-wrap"
					>
						{props.template.content}
					</Text>
				)}
			</Box>
		</Box>
	);
};

const TemplatesPreview = (
	props: DeepReadonly<
		| {
				type: 'done';
				templates: Templates;
		  }
		| {
				type: 'loading';
				templatesName: Array<Templates[0]['name']>;
		  }
	>
) => {
	const colorCount =
		props.type === 'done'
			? props.templates.length
			: props.templatesName.length;

	const palette = React.useMemo(() => {
		return iwanthue(Math.max(2, colorCount));
	}, [colorCount]);

	const paletteAt = (index: number) => {
		return Defined.parse(palette.at(index)).orThrow(
			new Error(`There is no palette at index of ${index}`)
		);
	};

	return (
		<Grid
			autoRows="1fr"
			gap={6}
			templateColumns="repeat(3, minmax(0, 1fr))"
			width="100%"
		>
			{props.type === 'loading'
				? props.templatesName.map((name, index) => {
						return (
							<GridItem key={name} width="100%">
								<TemplatePreview
									backgroundColor={paletteAt(index)}
									name={name}
									type="loading"
								/>
							</GridItem>
						);
					})
				: props.templates.map((template, index) => {
						return (
							<GridItem key={template.name} width="100%">
								<TemplatePreview
									backgroundColor={paletteAt(index)}
									template={template}
									type="ready"
								/>
							</GridItem>
						);
					})}
		</Grid>
	);
};

const useTemplateNotification = () => {
	const [type, setType] = React.useState(
		undefined as 'loading' | 'succeed' | 'failed' | undefined
	);

	React.useEffect(() => {
		toast.dismiss();

		switch (type) {
			case undefined: {
				break;
			}
			case 'loading': {
				toast.loading('Updating and retrieving templates...');
				break;
			}
			case 'succeed': {
				toast.success('All templates are updated and retrieved');
				break;
			}
			case 'failed': {
				toast.error('Failed to update and retrieve templates');
				break;
			}
		}
	}, [type]);

	return {
		failed: () => {
			setType('failed');
		},
		succeed: () => {
			setType('succeed');
		},
		loading: () => {
			setType('loading');
		},
	};
};

const useCopyNotification = () => {
	const [type, setType] = React.useState(undefined as 'succeed' | undefined);

	React.useEffect(() => {
		toast.dismiss();

		switch (type) {
			case undefined: {
				break;
			}
			case 'succeed': {
				toast.success('🎉 Copied All');
				break;
			}
		}
	}, [type]);

	return {
		succeed: () => {
			setType('succeed');
		},
		unset: () => {
			setType(undefined);
		},
	};
};

const Templates = () => {
	const delimiter = ',';

	const router = useRouter();

	const names = decodeURIComponent(
		parse(string(), router.query['names'] ?? '')
	)
		.split(delimiter)
		.filter(Boolean);

	const clipboard = useCopyToClipboard();

	const templateNotification = useTemplateNotification();

	const copyNotification = useCopyNotification();

	const [templates, setTemplates] = React.useState([] as Templates);

	const selected = templates.filter((props) => {
		return names.includes(props.name);
	});

	React.useEffect(() => {
		templateNotification.loading();

		void trpcClient.template.findAllTemplates
			.query()
			.then((result) => {
				if (!result.hadSucceed) {
					templateNotification.failed();
				} else {
					templateNotification.succeed();
				}

				return result;
			})
			.then((templates) => {
				if (templates.hadSucceed) {
					return templates.data;
				}

				throw templates.reason;
			})
			.then(setTemplates);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	React.useEffect(() => {
		if (clipboard.copied) {
			copyNotification.succeed();
		}
	}, [clipboard.copied, copyNotification]);

	return (
		<Layout title="Templates">
			<Seo
				description={Optional.some('List of .gitignore templates')}
				keywords={['templates', '.gitignore', 'gitignore', 'git']}
				title={Optional.some('Templates')}
				url="/templates"
			/>
			<ToastContainer autoClose={2500} position="top-center" stacked />
			<Container display="grid" maxWidth="100%" placeItems="center">
				<Box
					boxSizing="border-box"
					display="flex"
					flexDirection="column"
					gap={16}
					minHeight="30vh"
					pt={16}
					width={{
						xl: '80%',
						base: '90%',
					}}
				>
					<Box
						alignItems="center"
						display="flex"
						gap={8}
						justifyContent="space-between"
					>
						<QuerySection
							templates={{
								all: templates,
								selected,
								updateSelected: (selected) => {
									const query =
										formQueryParamStringFromRecord({
											names: selected
												.map(({ name }) => {
													return name;
												})
												.join(delimiter),
										});

									void router.push(
										{
											pathname: '/templates',
											query,
										},
										undefined,
										{
											shallow: true,
										}
									);
								},
							}}
						/>
						<ButtonGroup gap={4}>
							<Button
								colorScheme="messenger"
								isDisabled={!selected.length}
								onClick={() => {
									copyNotification.unset();
									clipboard.copy(combineTemplates(selected));
								}}
							>
								Copy All
							</Button>
							<Divider orientation="vertical" />
							<Button
								colorScheme="messenger"
								isDisabled={!selected.length}
								onClick={() => {
									const zip = selected.reduce(
										(zip, template) => {
											return zip.file(
												`${template.name}/.gitignore`,
												template.content
											);
										},
										new JSZip()
									);

									void zip
										.generateAsync({
											type: 'blob',
										})
										.then((value) => {
											saveAs(
												value,
												'gitignored-compressed.zip'
											);
										});
								}}
								variant="outline"
							>
								Zip All
							</Button>
						</ButtonGroup>
					</Box>
					<Box display="flex" justifyContent="space-between">
						<TemplatesPreview
							templates={selected}
							templatesName={names}
							type={selected.length ? 'done' : 'loading'}
						/>
					</Box>
				</Box>
			</Container>
		</Layout>
	);
};

export default Templates;
