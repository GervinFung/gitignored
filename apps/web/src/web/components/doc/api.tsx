import { Box } from '@chakra-ui/react';
import React from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { nightOwl } from 'react-syntax-highlighter/dist/cjs/styles/hljs';

const ErrorNote = () => {
	return (
		<Box my={4}>
			<SyntaxHighlighter
				customStyle={{ padding: '16px' }}
				language="javascript"
				style={nightOwl}
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
	);
};

export { ErrorNote };
