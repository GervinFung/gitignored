import { expect, it } from 'vitest';

import { externalAppCaller, internalAppCaller } from '../caller';
import { narrowToSucceed } from '../const';

const templateTest_1 = () => {
	const succeedResponse = <T>(data: T) => {
		return {
			status: 'succeed',
			data,
		};
	};

	it('should be able to insert templates and return result', async () => {
		const templatesResult =
			await internalAppCaller.template.findAllTemplates();

		expect(templatesResult).toStrictEqual({
			hadSucceed: true,
			data: narrowToSucceed(templatesResult).data.map(() => {
				return {
					// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
					name: expect.any(String),
					// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
					content: expect.any(String),
				};
			}),
		});

		const templates = narrowToSucceed(templatesResult);

		const latestCommittedTime =
			await externalAppCaller.templateBatch.latestCommittedTime();

		expect(latestCommittedTime).toStrictEqual(
			succeedResponse({
				// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
				latestCommittedTime: expect.any(Date),
			})
		);

		const data = await externalAppCaller.template.findAllTemplates();

		expect(data).toStrictEqual(
			succeedResponse({
				templates: templates.data,
			})
		);
	});
};

export default templateTest_1;
