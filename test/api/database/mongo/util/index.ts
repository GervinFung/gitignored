import testFormObjectIdsFromString from './formObjectIdsFromString';
import { describe } from 'vitest';

const testUtil = () => {
    describe('Util', () => {
        testFormObjectIdsFromString();
    });
};

export default testUtil;
