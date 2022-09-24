import { ObjectId } from 'mongodb';
import { formObjectIdsFromString } from '../../../../../src/api/database/mongo/util';
import { arrayDelimiter } from '../../../../../src/common/const';

const testFormObjectIdsFromString = () =>
    describe('Form ObjectIds from String', () => {
        it('should form id from string without delimiter at both end of id', () => {
            const id = '507f1f77bcf86cd799439011';
            expect(formObjectIdsFromString(` ${id} `)).toStrictEqual([
                new ObjectId(id),
            ]);
        });
        it('should form id from string with delimiter and space at both end of each id', () => {
            const idOne = '507f1f77bcf86cd799439011';
            const idTwo = '542c2b97bac0595474108b48';
            expect(
                formObjectIdsFromString(`${idOne}${arrayDelimiter} ${idTwo} `)
            ).toStrictEqual([new ObjectId(idOne), new ObjectId(idTwo)]);
        });
        it('should filter out invalid id', () => {
            const id = 'invalid';
            expect(formObjectIdsFromString(id)).toStrictEqual([]);
        });
    });

export default testFormObjectIdsFromString;
