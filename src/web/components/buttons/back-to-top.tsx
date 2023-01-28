import React from 'react';
import styled, { keyframes } from 'styled-components';
import { FaArrowUp } from 'react-icons/fa';

type BackToTopAnimation = Readonly<{
    isSlideIn: boolean;
}>;

const BackToTop = ({ isScroll }: Readonly<{ isScroll: boolean }>) => {
    const [state, setState] = React.useState({
        isLoad: isScroll,
        isAnimate: isScroll,
    });

    React.useEffect(() => {
        setState((prevState) => ({
            ...prevState,
            isAnimate: isScroll,
        }));
        const timeOut = setTimeout(
            () =>
                setState((prevState) => ({
                    ...prevState,
                    isLoad: isScroll,
                })),
            isScroll ? 0 : 350
        );
        return () => clearTimeout(timeOut);
    }, [isScroll]);

    const { isAnimate, isLoad } = state;

    return !isLoad ? null : (
        <BackToTopContainer>
            <ArrowUpContainer
                isSlideIn={isAnimate}
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
                <ArrowUp />
            </ArrowUpContainer>
        </BackToTopContainer>
    );
};

const BackToTopContainer = styled.div`
    position: fixed;
    right: 0;
    bottom: 0;
    z-index: 1;
`;

const FadeOut = keyframes`
    0% {
        opacity:1;
        transform: scale(1);
    }
    100% {
        opacity:0;
        transform: scale(0.9);
    }
`;

const FadeIn = keyframes`
    0% {
        opacity:0;
        transform: scale(0.9);
    }
    100% {
        opacity:1;
        transform: scale(1);
    }
`;

const ArrowUpContainer = styled.button`
    border-radius: 50%;
    border: none;
    &:hover {
        cursor: pointer;
        transition: 0.1s ease all;
    }
    &:active {
        transform: scale(1.25);
    }
    &:focus {
        outline: none;
    }
    padding: 15px;
    margin: 10px;
    background-color: ${({ theme }) => theme.black};
    animation: ${({ isSlideIn }: BackToTopAnimation) =>
            isSlideIn ? FadeIn : FadeOut}
        ease 0.5s;
    -moz-animation: ${({ isSlideIn }: BackToTopAnimation) =>
            isSlideIn ? FadeIn : FadeOut}
        ease 0.5s;
    -webkit-animation: ${({ isSlideIn }: BackToTopAnimation) =>
            isSlideIn ? FadeIn : FadeOut}
        ease 0.5s;
    -o-animation: ${({ isSlideIn }: BackToTopAnimation) =>
            isSlideIn ? FadeIn : FadeOut}
        ease 0.5s;
    -ms-animation: ${({ isSlideIn }: BackToTopAnimation) =>
            isSlideIn ? FadeIn : FadeOut}
        ease 0.5s;
`;

const ArrowUp = styled(FaArrowUp)`
    font-size: 1.75em !important;
    color: ${({ theme }) => theme.pureWhite} !important;
`;

export default BackToTop;
