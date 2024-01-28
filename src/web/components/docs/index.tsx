import React, { type PropsWithChildren } from 'react';

import {
	Box,
	Button,
	ButtonGroup,
	Container,
	Divider,
	Text,
} from '@chakra-ui/react';

import { useRouter } from 'next/router';

import InternalLink from '../common/link';
import { type DeepReadonly } from '@poolofdeath20/util';
import Layout from '../layout';
import { changeWordToUrl } from '../../util/url';

const docs = {
	content: {
		title: 'Content',
		items: ['Introduction', 'Getting Started'],
	},
	api: {
		title: 'API',
		items: ['Introduction', 'Commit Time', 'Templates', 'Templates Name'],
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
			<Divider mt={1} mb={2} />
			<Box>
				<ButtonGroup
					variant="ghost"
					spacing={0}
					display="grid"
					gridGap={4}
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
									width="100%"
									variant={
										props.match.title ===
											props.title.toLowerCase() &&
										props.match.item === item.toLowerCase()
											? 'solid'
											: 'ghost'
									}
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
			<Container maxWidth="100%" display="grid" placeItems="center">
				<Box
					pt={16}
					width={{
						xl: '80%',
						base: '90%',
					}}
					display="grid"
					gridTemplateColumns="3fr 0.5fr 9.5fr"
					gridGap={8}
					boxSizing="border-box"
				>
					<Box
						maxHeight="85vh"
						overflowX="auto"
						pr={4}
						pos="sticky"
						top={0}
					>
						<Item
							match={{ title, item }}
							title={docs.content.title}
							items={docs.content.items}
						/>
						<Item
							match={{ title, item }}
							title={docs.api.title}
							items={docs.api.items}
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
