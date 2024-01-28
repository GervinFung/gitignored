import { expect, it } from 'vitest';

import { externalAppCaller, internalAppCaller } from '../caller';
import { narrowToSucceed } from '../const';

const templateTest_1 = () => {
	it('should be able to insert templates and return result', async () => {
		const templatesResult =
			await internalAppCaller.template.findAllTemplates();

		expect(templatesResult).toStrictEqual({
			hadSucceed: true,
			data: narrowToSucceed(templatesResult).data.map(() => {
				return {
					name: expect.any(String),
					content: expect.any(String),
				};
			}),
		});

		const templates = narrowToSucceed(templatesResult);

		const latestCommittedTime =
			await externalAppCaller.templateBatch.latestCommittedTime();

		expect(latestCommittedTime).toStrictEqual({
			latestCommittedTime: expect.any(Date),
		});

		const data = await externalAppCaller.template.findAllTemplates();

		expect(data).toStrictEqual(templates.data);

		const template =
			await externalAppCaller.template.findAllTemplatesName();

		expect(template).toStrictEqual({
			template: {
				names: templates.data.map(({ name }) => {
					return name;
				}),
			},
		});
	});
};

export default templateTest_1;
