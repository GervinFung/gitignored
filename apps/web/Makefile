.PHONY: build test
MAKEFLAGS += --silent

## docker setup ubuntu
install-docker:
	sh script/docker/install.sh

## install
install:
	pnpm i --frozen-lockfile

generate-local-database-type:
	pnpm supabase gen types typescript --local > src/api/database/supabase/type.ts

generate-type-for-ci:
	make copy-env-testing &&\
		make start-testing-database &&\
		make migrate-up &&\
		make generate-typesafe-environment &&\
		make generate-local-database-type

## telemetry
opt-out-telemetry:
	pnpm next telemetry disable

## env
generate-typesafe-environment:
	pnpm vite-node script/env/type-def.ts

copy-env:
	cp config/.env.${environment} .env

copy-env-development:
	make copy-env environment="development" && cp supabase/config/normal.toml supabase/config.toml

copy-env-testing:
	make copy-env environment="testing" && cp supabase/config/test.toml supabase/config.toml

copy-env-production:
	make copy-env environment="production"

## generate
generate: generate-webmanifest generate-sitemap

generate-webmanifest:
	pnpm vite-node script/site/webmanifest.ts

generate-sitemap:
	pnpm next-sitemap

# database resest
migrate-up:
	pnpm supabase migration up

database-push:
	pnpm supabase db-push

reset-database:
	pnpm supabase db reset && make generate-typesafe-environment && make generate-local-database-type

restart-database:
	pnpm supabase stop && pnpm supabase start

start-testing-database:
	pnpm supabase stop && make copy-env-testing && pnpm supabase start

start-development-database:
	pnpm supabase stop && make copy-env-development && pnpm supabase start

## deployment
pre-deploy-production: copy-env-production build-production

clear-cache:
	rm -rf .next

# development
start-development: copy-env-development clear-cache dev

start-testing: copy-env-testing clear-cache dev

start-production: copy-env-production clear-cache dev

## build
build-development: copy-env-development clear-cache build

build-production: copy-env-production clear-cache build generate

build-testing: copy-env-testing clear-cache build

build:
	pnpm next build

## start
start:
	pnpm next start $(arguments)

## dev
dev:
	pnpm next dev

## format
format:
	pnpm prettier --$(type) .

format-check:
	make format type=check

format-write:
	make format type=write && pnpm vite-node script/formatter/sql.ts

## lint
lint:
	pnpm eslint . --color && pnpm knip

## typecheck
typecheck:
	pnpm tsc -p tsconfig.json $(arguments) 

## test
test-type:
	pnpm vitest test/$(path)/**.test.ts $(arguments)

test-unit:
	pnpm vitest test/unit/**/**.test.ts $(arguments)

test-integration: copy-env-testing
	make test-type path="integration" arguments="$(arguments)"

test-snapshot:
	make test-type path="snapshot" arguments="$(arguments)"

pretest-ci:
	node node_modules/puppeteer/install.mjs

kill-server:
	pnpm vite-node script/test/kill-server.ts

test: build-testing test-unit test-integration test-snapshot
