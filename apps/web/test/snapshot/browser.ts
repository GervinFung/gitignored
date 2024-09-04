import type { Browser } from 'puppeteer';

import { sleepInSeconds } from '@poolofdeath20/util';


const getWebSnapshot = async (
	param: Readonly<{
		link: string;
		port: number;
		browser: Browser;
	}>
) => {
	const page = await param.browser.newPage();

	await page.setViewport({ width: 1920, height: 1080 });

	await page.emulateMediaFeatures([
		{ name: 'prefers-color-scheme', value: 'dark' },
	]);

	await page.goto(
		`http://localhost:${param.port}/${
			param.link === 'home' ? '' : param.link
		}`
	);

	const isTemplate = param.link.startsWith('templates');

	if (isTemplate) {
		await page.reload({
			waitUntil: 'networkidle0',
		});
	}

	await sleepInSeconds({
		seconds: isTemplate ? 2 : 1,
	});

	return page.screenshot({ fullPage: true });
};

export { getWebSnapshot };
