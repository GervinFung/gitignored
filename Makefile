# lint
lint:
	pnpm --stream -r lint

lint-workflows:
	actionlint

# typecheck
typecheck:
	pnpm --stream -r typecheck

# format
format-write:
	pnpm --stream -r format-write

format-check:
	pnpm --stream -r format-check

# type
generate-type-for-ci:
	pnpm --stream -r generate-type-for-ci

# deploy
deploy-web:
	cd apps/web && make pre-deploy-production && cd ../../ && vercel --prod 
