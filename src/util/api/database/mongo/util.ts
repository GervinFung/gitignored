import { ObjectId } from 'mongodb';
import { arrayDelimiter } from '../../../../common/const';

const formObjectIdsFromString = (ids: string) =>
    ids.split(arrayDelimiter).map((id) => new ObjectId(id.trim()));

export { formObjectIdsFromString };
