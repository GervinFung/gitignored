import { toMatchImageSnapshot } from 'jest-image-snapshot';

import * as puppeteer from 'puppeteer';

import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import Server from '../server';

import { getWebSnapshot } from './browser';

const testSnapshot = () => {
	const server = Server.of(8080);

	let browser: undefined | puppeteer.Browser = undefined;

	beforeAll(async () => {
		browser = await server.start().then(() => {
			return puppeteer.launch({
				headless: true,
				defaultViewport: null,
				args: ['--start-maximized', '--no-sandbox'],
			});
		});
	});

	describe('Snapshot Test', () => {
		expect.extend({ toMatchImageSnapshot });

		const docs = ['commit-time', 'introduction', 'templates']
			.map((link) => {
				return `docs/api/${link}`;
			})
			.concat(
				['getting-started', 'introduction'].map((link) => {
					return `docs/content/${link}`;
				})
			);

		it.each(
			[
				'home',
				'docs',
				'templates?names=AL%2CActionscript%2CAndroid%2CAnsible%2CDart%2CDartEditor',
				'error',
			].concat(docs)
		)('should detect that layout of "%s" looks decent', async (link) => {
			if (!browser) {
				throw new TypeError('browser is undefined');
			}

			const dir = `${__dirname}/snapshot-images`;

			const image = await getWebSnapshot({
				link,
				browser,
				port: server.getPort(),
			});

			expect(image).toMatchImageSnapshot({
				customSnapshotsDir: dir,
				customSnapshotIdentifier: link.split('?').at(0),
				failureThreshold: 0.017,
				failureThresholdType: 'percent',
			});
		});
	});

	afterAll(() => {
		server.kill();
		browser?.close();
	});
};

testSnapshot();
