import React, { type PropsWithChildren } from 'react';

import Link from 'next/link';

const InternalLink = (
	props: PropsWithChildren &
		Readonly<{
			param: Readonly<Parameters<typeof Link>[number]>;
		}>
) => {
	return (
		<Link {...props.param} href={props.param.href.toString()}>
			{props.children}
		</Link>
	);
};

export default InternalLink;
