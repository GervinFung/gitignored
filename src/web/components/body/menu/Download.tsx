import React from 'react';
import Dropdown from './Dropdown';

const Download = <T extends string>({
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
        width={125}
        name="Download"
        menuItems={options}
        onChange={onChange}
        noIdsSelected={noIdsSelected}
        noGitIgnoreNamesAndIds={noGitIgnoreNamesAndIds}
        margin={{
            left: 16,
            right: 0,
        }}
    />
);

export default Download;
