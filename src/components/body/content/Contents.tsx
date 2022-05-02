import * as React from 'react';
import styled from 'styled-components';
import { GitIgnoreSelectedTechs } from '../../../common/type';
import Content from './Content';
import iwanthue from 'iwanthue';

type ContainerProps = Readonly<{
    columns: 1 | 2 | 3;
    widthPerColumn: 1 | 1.5 | 3;
}>;

const Contents = ({
    selectedTechs,
}: Readonly<{
    selectedTechs: GitIgnoreSelectedTechs;
}>) => {
    const [state, setState] = React.useState({
        palette: [] as ReadonlyArray<string>,
    });

    const { length } = selectedTechs;
    const { palette } = state;

    React.useEffect(() => {
        if (!length) {
            return;
        }
        const palette = iwanthue(length);
        setState((prev) => ({
            ...prev,
            palette: palette.map(
                (color, index) => prev.palette[index] ?? color
            ),
        }));
    }, [length]);

    return !length ? null : (
        <Container
            widthPerColumn={length >= 3 ? 1 : length === 1 ? 3 : 1.5}
            columns={length >= 3 ? 3 : (length as 2 | 1)}
        >
            {selectedTechs.map(({ name, content }, index) => (
                <Content
                    backgroundColor={palette[index] ?? ''}
                    key={name}
                    name={name}
                    content={content}
                />
            ))}
        </Container>
    );
};

const Container = styled.div`
    display: grid;
    grid-gap: 16px;
    width: ${({ widthPerColumn }: ContainerProps) =>
        `calc(100% / ${widthPerColumn})`};
    grid-template-columns: ${({ columns }: ContainerProps) =>
        `repeat(${columns}, minmax(0, 1fr))`};
`;

export default Contents;
