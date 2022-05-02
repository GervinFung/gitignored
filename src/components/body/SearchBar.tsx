import * as React from 'react';
import Select from 'react-select';
import styled from 'styled-components';
import { GitIgnoreNamesAndIds, GitIgnoreSelectedIds } from '../../common/type';
import { parseAsReadonlyArray, parseAsString } from 'parse-dont-validate';

const SearchBar = ({
    setSelectedIds,
    namesAndIds,
}: Readonly<{
    setSelectedIds: (selectedIds: GitIgnoreSelectedIds) => void;
    namesAndIds: GitIgnoreNamesAndIds;
}>) => (
    <Container>
        <GitIgnoreSelect
            defaultValue={undefined}
            placeholder="Search by Frameworks or Languages or IDEs or any Tech"
            isMulti={true}
            maxMenuHeight={200}
            options={namesAndIds.map(({ id, name }) => ({
                value: id,
                label: name,
            }))}
            onChange={(selectedGitIgnoreTechs: any) =>
                setSelectedIds(
                    parseAsReadonlyArray(selectedGitIgnoreTechs, (tech) =>
                        parseAsString(tech.value).orElseThrowDefault(tech)
                    ).orElseGetReadonlyEmptyArray()
                )
            }
        />
    </Container>
);

const Container = styled.div`
    display: flex;
    flex-direction: column;
`;

const GitIgnoreSelect = styled(Select)`
    width: 700px;
    margin: 16px 0;
`;

export default SearchBar;
