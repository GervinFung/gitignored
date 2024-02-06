postinstall:
	cd apps/cli && make install-rust

lint:
	pnpm --stream -r lint

typecheck:
	pnpm --stream -r typecheck

format-write:
	pnpm --stream -r format-write

format-check:
	pnpm --stream -r format-check

generate-type-for-ci:
	pnpm --stream -r generate-type-for-ci

deploy-web:
	cd apps/web && make pre-deploy-production && cd ../../ && vercel --prod 
