import React from 'react';

import { Box } from '@chakra-ui/react';

import SyntaxHighlighter from 'react-syntax-highlighter';

import * as Hljs from 'react-syntax-highlighter/dist/cjs/styles/hljs';

const ErrorNote = () => {
	return (
		<React.Fragment>
			<Box my={4}>
				<SyntaxHighlighter
					language="javascript"
					style={Hljs.nightOwl}
					customStyle={{ padding: '16px' }}
				>
					{JSON.stringify(
						{
							status: 'failed',
							reason: '<insert error message here>',
						},
						undefined,
						4
					)}
				</SyntaxHighlighter>
			</Box>
		</React.Fragment>
	);
};

export { ErrorNote };
