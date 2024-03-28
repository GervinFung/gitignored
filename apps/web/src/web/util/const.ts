const api = {
	templatesName: '/api/v0/templates-name',
	templates: '/api/v0/templates',
	commitTime: '/api/v0/commit-time',
} as const;

const constants = {
	repo: 'https://github.com/GervinFung/web',
	cargo: 'https://crates.io/crates/gitignored-cli',
} as const;

const title = 'GITIGNORED';

export { api, constants, title };
