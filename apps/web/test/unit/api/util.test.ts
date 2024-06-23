import { describe, it, expect } from 'vitest';

import { isMoreThanOrEqualOneWeek } from '../../../src/api/logic/util';

describe('API util', () => {
	it('should determine if a given date has been more than 1 week', () => {
		const largerOrEqual = isMoreThanOrEqualOneWeek(
			new Date('2022-12-18T19:57:19.000Z')
		);

		expect(largerOrEqual).toBe(true);

		const smaller = isMoreThanOrEqualOneWeek(new Date());

		expect(smaller).toBe(false);
	});
});
