import testGenerator from './generator';
import testParser from './parser';

const testComponentLogic = () =>
    describe('Component Logic', () => {
        testGenerator();
        testParser();
    });

export default testComponentLogic;
