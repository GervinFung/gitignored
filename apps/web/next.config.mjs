import withPWAInit from '@ducanh2912/next-pwa';

const withPWA = withPWAInit({
	dest: 'public',
	sw: 'service-worker.js',
});

/** @type {import('next').NextConfig} */
const config = {
	productionBrowserSourceMaps: true,
	reactStrictMode: true,
};

export default withPWA(config);
