import type {PropsWithChildren} from 'react';

import Link from 'next/link';
import React from 'react';


const InternalLink = (
	props: PropsWithChildren &
		Readonly<{
			param: Readonly<Parameters<typeof Link>[number]>;
		}>
) => {
	return <Link {...props.param}>{props.children}</Link>;
};

export default InternalLink;
