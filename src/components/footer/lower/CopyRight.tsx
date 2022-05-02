import * as React from 'react';
import styled from 'styled-components';

const CopyRight = () => {
    const originYear = 2022;
    const year = new Date().getFullYear();

    return (
        <Container>
            Copyright &copy;{' '}
            {year === originYear ? year : `${originYear} - ${year}`}
        </Container>
    );
};

const Container = styled.div`
    font-size: 1em;
`;

export default CopyRight;
