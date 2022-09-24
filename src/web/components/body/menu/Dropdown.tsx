import React from 'react';
import styled, { css, keyframes } from 'styled-components';
import { MenuButton, MenuItem, Menu as MenuInner } from '@szhsin/react-menu';
import {
    menuSelector,
    menuItemSelector,
    menuDividerSelector,
} from '@szhsin/react-menu/style-utils';
import '@szhsin/react-menu/dist/core.css';

type MenuButtonMargin = Readonly<{
    margin: string;
}>;

type MenuName = 'Preview' | 'Download';

type MenuButtonStyledProps = MenuButtonMargin &
    Readonly<{
        name: MenuName;
    }>;

const Dropdown = <T extends string>({
    menuItems,
    name,
    onChange,
    margin: { left, right },
    width,
}: Readonly<{
    menuItems: ReadonlyArray<T>;
    onChange: (t: T) => void;
    name: MenuName;
    margin: Readonly<{
        left: number;
        right: number;
    }>;
    width: number;
}>) => (
    <Menu
        width={width}
        transition
        menuButton={
            <MenuButtonStyled name={name} margin={`0 ${right}px 0 ${left}px`}>
                {name}
            </MenuButtonStyled>
        }
    >
        {menuItems.map((item) => (
            <MenuItem onClick={() => onChange(item)} key={item}>
                {item}
            </MenuItem>
        ))}
    </Menu>
);

const MenuButtonBackground = css`
    margin: ${({ margin }: MenuButtonStyledProps) => margin};
    background-color: ${({ name }: MenuButtonStyledProps) =>
        ({ theme }) =>
            name === 'Preview' ? theme.previewButton : theme.downloadButton};
    &:hover {
        background-color: ${({ name }: MenuButtonStyledProps) =>
            ({ theme }) =>
                name === 'Preview'
                    ? theme.previewButtonHover
                    : theme.downloadButtonHover};
    }
`;

const MenuButtonStyled = styled(MenuButton)`
    border: none;
    border-radius: 4px;
    padding: 8px 24px;
    font-size: 1em;
    cursor: pointer;
    transition: ease-in all 0.1s;
    font-family: ${({ theme }) => theme.fontFamily};
    color: ${({ theme }) => theme.pureWhite};
    ${MenuButtonBackground}
`;

const menuShow = keyframes`
    from {
        opacity: 0;
    }
`;
const menuHide = keyframes`
    to {
        opacity: 0;
    }
`;

const Menu = styled(MenuInner)`
    ${menuSelector.name} {
        font-size: 0.925rem;
        user-select: none;
        box-shadow: 1px 1px 20px 1px rgba(0, 0, 0, 0.1);
        border-radius: 6px;
        padding: 8px;
        width: ${({ width }: Readonly<{ width: number }>) => `${width}px`};
    }

    ${menuSelector.stateOpening} {
        animation: ${menuShow} 0.15s ease-out;
    }

    ${menuSelector.stateClosing} {
        animation: ${menuHide} 0.2s ease-out forwards;
    }

    ${menuItemSelector.name} {
        border-radius: 6px;
        padding: 0.375rem 0.625rem;
    }

    ${menuDividerSelector.name} {
        margin: 0.5rem 0.625rem;
    }

    ${menuItemSelector.submenu} {
        position: relative;
    }
`;

export default Dropdown;
