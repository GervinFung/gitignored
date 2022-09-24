import React from 'react';
import Link from 'next/link';

const CustomLink = ({
    param,
    children,
}: Readonly<{
    children: React.ReactNode;
    param: Readonly<Parameters<typeof Link>[number]>;
}>) => (
    <Link {...param}>
        <a>{children}</a>
    </Link>
);

export default CustomLink;
