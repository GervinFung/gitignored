import React from 'react';

import { useRouter } from 'next/router';

import iwanthue from 'iwanthue';

import JSZip from 'jszip';

import { saveAs } from 'file-saver';

import Select from 'react-select';

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

import styled from '@emotion/styled';

import { parse, object, array, string, transform, nullable } from 'valibot';

import Fuse from 'fuse.js';

import {
	type DeepReadonly,
	Optional,
	formQueryParamStringFromRecord,
	Defined,
	equalTo,
	isFalsy,
} from '@poolofdeath20/util';

import { ToastContainer, toast } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.min.css';

import Layout from '../../src/web/components/layout';
import Seo from '../../src/web/components/seo';

import trpcClient from '../../src/web/proxy/client';
import { type Templates } from '../../src/api/database/persistence/template';
import {
	combineTemplates,
	generateContrastingColor,
} from '../../src/web/util/generator';

type Template = Templates[number];

const schemas = {
	names: string(),
	cacheOrdinaryTemplates: transform(
		nullable(
			array(
				object({
					name: string(),
					content: string(),
				})
			)
		),
		Optional.from
	),
	selectedOrdinaryTemplatesId: array(
		object({
			value: string(),
		})
	),
};

const StyledSelect = styled(Select)`
	width: 700px;
	> div > div {
		padding: 4px 8px;
	}
	@media (max-width: 808px) {
		width: 600px;
	}
	@media (max-width: 672px) {
		width: 500px;
	}
`;

const useCopyToClipboard = () => {
	const [copied, setCopied] = React.useState(false);

	React.useEffect(() => {
		if (!copied) {
			return;
		}

		const timeOut = setTimeout(() => {
			setCopied(false);
		}, 1000 * 2);

		return () => {
			clearTimeout(timeOut);
		};
	}, [copied]);

	return {
		copied,
		copy: (text: string) => {
			if (navigator?.clipboard?.writeText) {
				setCopied(true);

				navigator.clipboard.writeText(text);
			} else {
				const element = document.createElement('textarea');

				element.value = text;

				element.setAttribute('readonly', '');

				element.style.position = 'absolute';

				element.style.left = '-9999px';

				document.body.appendChild(element);

				element.select();

				document.execCommand('copy');

				document.body.removeChild(element);

				setCopied(true);
			}
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
	const clipboard = useCopyToClipboard();

	return (
		<Box
			p={4}
			width="100vw"
			maxWidth="100%"
			height="100%"
			borderRadius={4}
			backgroundColor="gray.100"
			display="flex"
			boxSizing="border-box"
			flexDirection="column"
			gridGap={4}
		>
			<Box
				display="flex"
				justifyContent="space-between"
				alignItems="center"
			>
				<Box
					py={2}
					px={4}
					fontSize="small"
					boxSizing="border-box"
					borderRadius={4}
					width="fit-content"
					backgroundColor={props.backgroundColor}
					color={generateContrastingColor(props.backgroundColor)}
				>
					<Text>
						{props.type === 'loading'
							? props.name
							: props.template.name}
					</Text>
				</Box>
				<Button
					fontSize="small"
					boxSizing="border-box"
					borderRadius={4}
					variant="solid"
					isDisabled={props.type === 'loading'}
					backgroundColor="#282A36"
					color="#FFF"
					_hover={{
						color: '#FFF',
						backgroundColor: '#282A36',
					}}
					onClick={() => {
						if (props.type === 'loading') {
							throw new Error(`Cannot click when it's loading`);
						}

						clipboard.copy(props.template.content);
					}}
				>
					{!clipboard.copied ? 'Copy' : '🎉 Copied'}
				</Button>
			</Box>
			<Box>
				{props.type === 'loading' ? (
					<Skeleton height="450px" minWidth="100%" />
				) : (
					<Text
						height="450px"
						fontSize="x-small"
						whiteSpace="pre-wrap"
						overflow="auto"
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
				templatesName: Templates[0]['name'][];
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
			gap={6}
			width="100%"
			autoRows="1fr"
			templateColumns="repeat(3, minmax(0, 1fr))"
		>
			{props.type === 'loading'
				? props.templatesName.map((name, index) => {
						return (
							<GridItem key={name} width="100%">
								<TemplatePreview
									type="loading"
									name={name}
									backgroundColor={paletteAt(index)}
								/>
							</GridItem>
						);
					})
				: props.templates.map((template, index) => {
						return (
							<GridItem key={template.name} width="100%">
								<TemplatePreview
									type="ready"
									template={template}
									backgroundColor={paletteAt(index)}
								/>
							</GridItem>
						);
					})}
		</Grid>
	);
};

const QuerySection = (
	props: DeepReadonly<{
		templates: {
			all: Templates;
			selected: Templates;
			updateSelected: (templates: Templates) => void;
		};
	}>
) => {
	const updateDependency =
		props.templates.selected
			.map(({ name }) => {
				return name;
			})
			.join() ||
		props.templates.all
			.map(({ name }) => {
				return name;
			})
			.join();

	return React.useMemo(() => {
		return (
			<StyledSelect
				isDisabled={isFalsy(props.templates.all.length)}
				isMulti={true}
				maxMenuHeight={200}
				placeholder="Search by Techs"
				loadingMessage={() => {
					return (
						<Box>
							<Text>Getting all the templates...</Text>
						</Box>
					);
				}}
				filterOption={({ label }, input) => {
					if (!input) {
						return true;
					}

					if (
						props.templates.all
							.map(({ name }) => {
								return name.toLowerCase();
							})
							.find(equalTo(input.toLowerCase()))
					) {
						return label.toLowerCase() === input.toLowerCase();
					}

					return (
						(new Fuse([label], {
							includeScore: true,
						})
							.search(input)
							.at(0)?.score ?? 1) <= 0.5
					);
				}}
				options={props.templates.all
					.toSorted((previous, current) => {
						return previous.name.localeCompare(
							current.name,
							undefined,
							{
								ignorePunctuation: true,
							}
						);
					})
					.map(({ name }) => {
						return {
							value: name,
							label: name,
						};
					})}
				onChange={(selectedTemplatesId) => {
					const names = parse(
						schemas.selectedOrdinaryTemplatesId,
						selectedTemplatesId
					).map(({ value }) => {
						return value;
					});

					props.templates.updateSelected(
						props.templates.all.filter(({ name }) => {
							return names.includes(name);
						})
					);
				}}
				value={props.templates.selected.map(({ name }) => {
					return {
						value: name,
						label: name,
					};
				})}
			/>
		);
	}, [updateDependency]);
};

const useNotification = () => {
	const [type, setType] = React.useState(
		'none' as 'loading' | 'succeed' | 'none' | 'failed'
	);

	React.useEffect(() => {
		toast.dismiss();

		switch (type) {
			case 'none': {
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

const Templates = () => {
	const delimiter = ',';

	const router = useRouter();

	const names = decodeURIComponent(
		parse(schemas.names, router.query.names ?? '')
	)
		.split(delimiter)
		.filter(Boolean);

	const clipboard = useCopyToClipboard();

	const notification = useNotification();

	const [templates, setTemplate] = React.useState([] as Templates);

	const selected = templates.filter((props) => {
		return names.includes(props.name);
	});

	React.useEffect(() => {
		notification.loading();

		trpcClient.template.findAllTemplates
			.query()
			.then((result) => {
				if (!result.hadSucceed) {
					notification.failed();
				} else {
					notification.succeed();
				}

				return result;
			})
			.then((templates) => {
				if (templates.hadSucceed) {
					return templates.data;
				}

				throw templates.reason;
			})
			.then(setTemplate);
	}, [templates.length]);

	return (
		<Layout title="Templates">
			<Seo
				url="/templates"
				title={Optional.some('Templates')}
				description={Optional.some('List of .gitignore templates')}
				keywords={['templates', '.gitignore', 'gitignore', 'git']}
			/>
			<ToastContainer position="top-center" autoClose={2500} stacked />
			<Container maxWidth="100%" display="grid" placeItems="center">
				<Box
					pt={16}
					display="flex"
					flexDirection="column"
					gap={16}
					width={{
						xl: '80%',
						base: '90%',
					}}
					minHeight="30vh"
					boxSizing="border-box"
				>
					<Box display="flex" justifyContent="space-between">
						<QuerySection
							templates={{
								all: templates,
								selected,
								updateSelected: (selected) => {
									const params =
										formQueryParamStringFromRecord({
											names: selected
												.map(({ name }) => {
													return name;
												})
												.join(delimiter),
										});

									router.push(
										{
											pathname: '/templates',
											query: params,
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
								isDisabled={isFalsy(selected.length)}
								onClick={() => {
									clipboard.copy(combineTemplates(selected));
								}}
							>
								{!clipboard.copied
									? 'Copy All'
									: '🎉 Copied All'}
							</Button>
							<Divider orientation="vertical" />
							<Button
								colorScheme="messenger"
								variant="outline"
								isDisabled={isFalsy(selected.length)}
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

									zip.generateAsync({
										type: 'blob',
									}).then((value) => {
										saveAs(
											value,
											'gitignored-compressed.zip'
										);
									});
								}}
							>
								Zip All
							</Button>
						</ButtonGroup>
					</Box>
					<Box display="flex" justifyContent="space-between">
						<TemplatesPreview
							type={selected.length ? 'done' : 'loading'}
							templatesName={names}
							templates={selected}
						/>
					</Box>
				</Box>
			</Container>
		</Layout>
	);
};

export default Templates;
