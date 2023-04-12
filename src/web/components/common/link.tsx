import React from 'react';
import Link from 'next/link';

const CustomLink = ({
    param,
    children,
}: Readonly<{
    children: React.ReactNode;
    param: Readonly<Parameters<typeof Link>[number]>;
}>) => (
    <Link {...param} href={param.href.toString()}>
        {children}
    </Link>
);

export default CustomLink;
