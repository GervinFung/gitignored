import testMongo from './api/database/mongo';
import testScrapper from './api/scrapper';
import testComponentLogic from './web/component/util';
import testCases from 'cases-of-test';

testCases({
    tests: [[testScrapper], [testMongo], [testComponentLogic]],
});
