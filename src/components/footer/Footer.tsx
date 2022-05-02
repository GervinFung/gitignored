import * as React from 'react';
import styled from 'styled-components';
import BackToTop from '../buttons/BackToTop';
import Lower from './lower';
import Upper from './upper';

const Footer = () => {
    const [state, setState] = React.useState({
        isScroll: false,
    });

    const { isScroll } = state;

    React.useEffect(() => {
        const handlePageOffset = () =>
            setState((prevState) => ({
                ...prevState,
                isScroll: window.pageYOffset > 150,
            }));
        window.addEventListener('scroll', handlePageOffset);
        return () => {
            window.removeEventListener('scroll', handlePageOffset);
        };
    }, []);

    return (
        <Container>
            <BackToTop isScroll={isScroll} />
            <UpperContainer>
                <Upper />
                <HorizontalLine />
                <Lower />
            </UpperContainer>
        </Container>
    );
};

const Container = styled.div`
    width: 100%;
    padding: 16px;
    box-sizing: border-box;
    color: ${({ theme }) => theme.pureWhite};
    background-color: ${({ theme }) => theme.primaryColor};
`;

const UpperContainer = styled.div`
    width: 70%;
    padding: 16px;
    box-sizing: border-box;
    margin: 0 auto;
`;

const HorizontalLine = styled.hr`
    width: 100%;
    align-items: flex-start;
    margin: 16px 0;
    background-color: ${({ theme }) => theme.pureWhite};
    height: 1px;
    border: 0;
`;

export default Footer;
