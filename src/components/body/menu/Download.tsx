import * as React from 'react';
import Dropdown from './Dropdown';

const Download = <T extends string>({
    options,
    onChange,
}: Readonly<{
    options: ReadonlyArray<T>;
    onChange: (t: T) => void;
}>) => (
    <Dropdown
        name="Download"
        menuItems={options}
        margin={{
            left: 16,
            right: 0,
        }}
        onChange={onChange}
        width={125}
    />
);

export default Download;
