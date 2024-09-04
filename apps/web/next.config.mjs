import process from 'process';

import withPWAInit from '@ducanh2912/next-pwa';

const isDevelopment = process.env.NEXT_PUBLIC_NODE_ENV === 'development';

const withPWA = withPWAInit({
	dest: 'public',
	sw: 'service-worker.js',
	disable: isDevelopment,
});

/** @type {import('next').NextConfig} */
const config = {
	reactStrictMode: true,
	productionBrowserSourceMaps: isDevelopment,
};

export default withPWA(config);
