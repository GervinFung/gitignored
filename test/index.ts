import testMongo from './api/database/mongo';
import testScrapper from './api/scrapper';
import testComponentLogic from './web/component/util';

const tests: ReadonlyArray<readonly [() => void, 'only'?]> = [
    [testScrapper],
    [testMongo],
    [testComponentLogic],
];

const selectedTests = tests.filter(([_, only]) => only);

if (process.env.IS_CI && selectedTests.length) {
    throw new Error('cannot have "only" in ci cd');
}

(!selectedTests.length ? tests : selectedTests).forEach(([test]) => test());
