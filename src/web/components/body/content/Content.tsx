import React from 'react';
import styled from 'styled-components';
import type { GitIgnoreSelectedTechs } from '../../../../common/type';
import { generateContrastingColor } from '../../../util';

type NameProps = Readonly<{
    backgroundColor: string;
    color: '#FFF' | '#000';
}>;

const Content = ({
    name,
    content,
    backgroundColor,
}: Readonly<
    {
        backgroundColor: string;
    } & GitIgnoreSelectedTechs[0]
>) => {
    const [state, setState] = React.useState({
        isCopied: false,
    });

    const { isCopied } = state;

    React.useEffect(() => {
        if (isCopied) {
            setTimeout(() => {
                setState((prev) => ({
                    ...prev,
                    isCopied: false,
                }));
            }, 1000 * 2);
        }
    }, [isCopied]);

    return (
        <Container>
            <NameAndCopyContainer>
                <Name
                    backgroundColor={backgroundColor}
                    color={generateContrastingColor(backgroundColor)}
                >
                    {name}
                </Name>
                <Button
                    onClick={() => {
                        if (navigator?.clipboard?.writeText) {
                            setState((prev) => ({
                                ...prev,
                                isCopied: true,
                            }));
                            return navigator.clipboard.writeText(content);
                        }
                        const el = document.createElement('textarea');
                        el.value = content;
                        el.setAttribute('readonly', '');
                        el.style.position = 'absolute';
                        el.style.left = '-9999px';
                        document.body.appendChild(el);
                        el.select();
                        document.execCommand('copy');
                        document.body.removeChild(el);
                        setState((prev) => ({
                            ...prev,
                            isCopied: true,
                        }));
                        return;
                    }}
                >
                    {!isCopied ? 'Copy' : '🎉 Copied'}
                </Button>
            </NameAndCopyContainer>
            <GitIgnoreContent>
                <code>{content}</code>
            </GitIgnoreContent>
        </Container>
    );
};

const Container = styled.div`
    max-width: 100%;
    padding: 8px;
    border-radius: 4px;
    background-color: ${({ theme }) => theme.gitIgnoreCodeBlock};
`;

const NameAndCopyContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
`;

const BoxDisplay = styled.div`
    padding: 8px 12px;
    font-size: 0.8em;
    width: fit-content;
    border-radius: 4px;
    box-sizing: border-box;
`;

const Name = styled(BoxDisplay)`
    color: ${({ color }: NameProps) => color};
    background-color: ${({ backgroundColor }: NameProps) => backgroundColor};
`;

const Button = styled(BoxDisplay)`
    cursor: pointer;
    background-color: ${({ theme }) => theme.copyButtonBackground};
    color: ${({ theme }) => theme.pureWhite};
`;

const GitIgnoreContent = styled.pre`
    box-sizing: border-box;
    min-height: 250px;
    max-height: 250px;
    max-width: 100%;
    overflow: auto;
    word-break: break-word;
    font-size: 0.85em;
    color: ${({ theme }) => theme.gitIgnoreCodeColor};
`;

export default Content;
