import React from 'react';
import styled from 'styled-components';

const IntroText = () => (
    <Container>
        <Text>
            Have you ever wonder what&apos;s the most commonly used{' '}
            <code>.gitignore</code> template?
        </Text>
        <Text>Are you unsure of what should be ignored by git?</Text>
        <Text>
            <b>Say no more!</b>
        </Text>
    </Container>
);

const Text = styled.p`
    font-size: 1em;
`;

const Container = styled.div`
    text-align: center;
`;

export default IntroText;
