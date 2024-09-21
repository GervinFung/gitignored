import Script from 'next/script';
import React from 'react';

const Schema = () => {
	const docs = ['commit-time', 'introduction', 'templates-name', 'templates']
		.map((link) => {
			return `docs/api/${link}`;
		})
		.concat(
			['getting-started', 'introduction'].map((link) => {
				return `docs/content/${link}`;
			})
		);

	const names = ['home', 'docs', 'templates', 'error'].concat(docs);

	const structuredData = {
		'@context': 'https://schema.org',
		'@type': 'BreadcrumbList',
		itemListElement: names.map((name) => {
			return {
				'@type': 'ListItem',
				position: name.split('/').length,
				item: {
					name,
					'@id': `${process.env.NEXT_PUBLIC_ORIGIN}/${name}`,
				},
			};
		}),
	};

	return (
		<Script
			dangerouslySetInnerHTML={{
				__html: JSON.stringify(structuredData, undefined, 4),
			}}
			type="application/ld+json"
		/>
	);
};

export default Schema;
