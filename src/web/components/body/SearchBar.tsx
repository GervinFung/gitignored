import React from 'react';
import Select from 'react-select';
import styled from 'styled-components';
import type {
    DeepReadonly,
    GitIgnoreNamesAndIds,
    GitIgnoreSelectedIds,
} from '../../../common/type';
import { parseAsArray, parseAsString } from '../../../common/util/parser';

const SearchBar = ({
    names,
    namesAndIds,
    onChange,
}: DeepReadonly<{
    names: Array<string>;
    namesAndIds: GitIgnoreNamesAndIds;
    onChange: (selectedIds: GitIgnoreSelectedIds) => void;
}>) => {
    const Select = () =>
        React.useMemo(
            () => (
                <GitIgnoreSelect
                    isMulti={true}
                    maxMenuHeight={200}
                    placeholder="Search by Frameworks or Languages or IDEs or any Tech"
                    options={namesAndIds.map(({ id, name }) => ({
                        value: id,
                        label: name,
                    }))}
                    onChange={(selectedGitIgnoreTechs) =>
                        onChange(
                            parseAsArray(selectedGitIgnoreTechs, (tech) =>
                                parseAsString(tech.value)
                            )
                        )
                    }
                    defaultValue={namesAndIds.flatMap(({ id, name }) =>
                        !names.includes(name)
                            ? []
                            : [
                                  {
                                      value: id,
                                      label: name,
                                  },
                              ]
                    )}
                />
            ),
            [names.join()]
        );

    return (
        <Container>
            <Select />
        </Container>
    );
};

const Container = styled.div`
    display: flex;
    flex-direction: column;
`;

const GitIgnoreSelect = styled(Select)`
    width: 700px;
    margin: 16px 0;
    @media (max-width: 808px) {
        width: 600px;
    }
    @media (max-width: 672px) {
        width: 500px;
    }
`;

export default SearchBar;
