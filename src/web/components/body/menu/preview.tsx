import React from 'react';
import Dropdown from './dropdown';

const Preview = <T extends string>({
    options,
    onChange,
    noIdsSelected,
    noGitIgnoreNamesAndIds,
}: Readonly<{
    noIdsSelected: boolean;
    options: ReadonlyArray<T>;
    onChange: (t: T) => void;
    noGitIgnoreNamesAndIds: boolean;
}>) => (
    <Dropdown
        width={117}
        name="Preview"
        menuItems={options}
        onChange={onChange}
        noIdsSelected={noIdsSelected}
        noGitIgnoreNamesAndIds={noGitIgnoreNamesAndIds}
        margin={{
            left: 0,
            right: 16,
        }}
    />
);

export default Preview;
