import testMongo from './database/mongo';
import testScrapper from './scrapper';
import testComponentLogic from './util/component-logic';

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
