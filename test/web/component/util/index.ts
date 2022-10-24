import testGenerator from './generator';
import testParser from './parser';
import testCases from 'cases-of-test';
import { describe } from 'vitest';

const testComponentLogic = () =>
    describe('Component Logic', () => {
        testCases({
            tests: [[testGenerator], [testParser]],
        });
    });

export default testComponentLogic;
