import type { Templates } from '../../../api/database/persistence/template';
import type { DeepReadonly } from '@poolofdeath20/util';

import { Box, Text } from '@chakra-ui/react';
import styled from '@emotion/styled';
import { equalTo } from '@poolofdeath20/util';
import Fuse from 'fuse.js';
import React from 'react';
import Select from 'react-select';
import { array, object, parse, string } from 'valibot';

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
				isDisabled={!props.templates.all.length}
				isMulti
				loadingMessage={() => {
					return (
						<Box>
							<Text>Getting all the templates...</Text>
						</Box>
					);
				}}
				maxMenuHeight={200}
				onChange={(selectedTemplatesId) => {
					const names = parse(
						array(
							object({
								value: string(),
							})
						),
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
				placeholder="Search by Techs"
				value={props.templates.selected.map(({ name }) => {
					return {
						value: name,
						label: name,
					};
				})}
			/>
		);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [updateDependency]);
};

export default QuerySection;
