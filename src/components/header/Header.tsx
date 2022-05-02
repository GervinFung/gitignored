import * as React from 'react';
import styled from 'styled-components';
import GitHubIcon from './GitHub';
import Logo from './Logo';
import ToggleTheme from './Toggle';

const Header = ({
    isDarkMode,
    setIsDarkMode,
}: Readonly<{
    isDarkMode: boolean;
    setIsDarkMode: () => void;
}>) => (
    <Container>
        <Logo />
        <RightContainer>
            <ToggleTheme
                isDarkMode={isDarkMode}
                setIsDarkMode={setIsDarkMode}
            />
            <GitHubIcon />
        </RightContainer>
    </Container>
);

const Container = styled.div`
    width: 100%;
    padding: 16px 24px;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    align-items: center;
    > a {
        text-decoration: none;
    }
    background-color: ${({ theme }) => theme.primaryColor};
`;

const RightContainer = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    grid-gap: 8px;
`;

export default Header;
