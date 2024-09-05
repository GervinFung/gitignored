import type { DeepReadonly } from '@poolofdeath20/util';
import type { PropsWithChildren } from 'react';

import {
	Box,
	Button,
	ButtonGroup,
	Container,
	Divider,
	Text,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

import { changeWordToUrl } from '../../util/url';
import InternalLink from '../common/link';
import Layout from '../layout';

const docs = {
	content: {
		title: 'Content',
		items: ['Introduction', 'Getting Started'],
	},
	api: {
		title: 'API',
		items: ['Introduction', 'Commit Time', 'Templates'],
	},
} as const;

const Item = (
	props: DeepReadonly<{
		mb?: false;
		title: string;
		items: Array<string>;
		match: {
			title: string | undefined;
			item: string | undefined;
		};
	}>
) => {
	return (
		<Box mb={props.mb ? 0 : 8}>
			<Text as="b" color="GrayText">
				{props.title}
			</Text>
			<Divider mb={2} mt={1} />
			<Box>
				<ButtonGroup
					display="grid"
					gridGap={4}
					spacing={0}
					variant="ghost"
				>
					{props.items.map((item) => {
						return (
							<InternalLink
								key={item}
								param={{
									href: `/docs/${changeWordToUrl(
										props.title
									)}/${changeWordToUrl(item)}`,
								}}
							>
								<Button
									//ref: https://github.com/chakra-ui/chakra-ui/issues/44#issuecomment-529222453
									justifyContent="flex-start"
									variant={
										props.match.title ===
											props.title.toLowerCase() &&
										props.match.item === item.toLowerCase()
											? 'solid'
											: 'ghost'
									}
									width="100%"
								>
									{item}
								</Button>
							</InternalLink>
						);
					})}
				</ButtonGroup>
			</Box>
		</Box>
	);
};

const Documentation = (
	props: PropsWithChildren &
		DeepReadonly<
			| undefined
			| {
					title: string;
			  }
		>
) => {
	const router = useRouter();

	const [_, __, title, item] = router.asPath.split('/');

	return (
		<Layout title={!props ? 'Docs' : `Docs - ${props.title}`}>
			<Container display="grid" maxWidth="100%" placeItems="center">
				<Box
					boxSizing="border-box"
					display="grid"
					gridGap={8}
					gridTemplateColumns="3fr 0.5fr 9.5fr"
					pt={16}
					width={{
						xl: '80%',
						base: '90%',
					}}
				>
					<Box
						maxHeight="85vh"
						overflowX="auto"
						pos="sticky"
						pr={4}
						top={0}
					>
						<Item
							items={docs.content.items}
							match={{ title, item }}
							title={docs.content.title}
						/>
						<Item
							items={docs.api.items}
							match={{ title, item }}
							title={docs.api.title}
						/>
					</Box>
					<Divider orientation="vertical" />
					<Box textAlign="justify">{props?.children}</Box>
				</Box>
			</Container>
		</Layout>
	);
};

export { docs };

export default Documentation;
