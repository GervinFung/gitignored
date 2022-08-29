import { ObjectId } from 'mongodb';
import { arrayDelimiter } from '../../common/const';

const formObjectIdsFromString = (ids: string) =>
    ids.split(arrayDelimiter).flatMap((id) => {
        const trimmedId = id.trim();
        return !ObjectId.isValid(trimmedId) ? [] : [new ObjectId(trimmedId)];
    });

export { formObjectIdsFromString };
