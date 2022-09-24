import React from 'react';
import Select from 'react-select';
import styled from 'styled-components';
import type {
    GitIgnoreNamesAndIds,
    GitIgnoreSelectedIds,
} from '../../../common/type';
import { parseAsArray, parseAsString } from '../../../common/util/parser';

const SearchBar = ({
    namesAndIds,
    setSelectedIds,
}: Readonly<{
    namesAndIds: GitIgnoreNamesAndIds;
    setSelectedIds: (selectedIds: GitIgnoreSelectedIds) => void;
}>) => (
    <Container>
        <GitIgnoreSelect
            isMulti={true}
            maxMenuHeight={200}
            defaultValue={undefined}
            placeholder="Search by Frameworks or Languages or IDEs or any Tech"
            options={namesAndIds.map(({ id, name }) => ({
                value: id,
                label: name,
            }))}
            onChange={(selectedGitIgnoreTechs) =>
                setSelectedIds(
                    parseAsArray(selectedGitIgnoreTechs, (tech) =>
                        parseAsString(tech.value)
                    )
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
    @media (max-width: 808px) {
        width: 600px;
    }
    @media (max-width: 672px) {
        width: 500px;
    }
`;

export default SearchBar;
