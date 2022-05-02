import * as React from 'react';
import Dropdown from './Dropdown';

const Preview = <T extends string>({
    options,
    onChange,
}: Readonly<{
    options: ReadonlyArray<T>;
    onChange: (t: T) => void;
}>) => (
    <Dropdown
        name="Preview"
        menuItems={options}
        margin={{
            left: 0,
            right: 16,
        }}
        width={117}
        onChange={onChange}
    />
);

export default Preview;
