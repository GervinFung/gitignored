.PHONY: build test all
MAKEFLAGS += --silent

all:
	make lint &&\
		make typecheck &&\
		make format-check &&\
		make test &&\
		make build

NODE_BIN=node_modules/.bin/
VITE_NODE=$(NODE_BIN)vite-node
NEXT=$(NODE_BIN)next

## generate
generate-webmanifest:
	$(VITE_NODE) script/site/webmanifest.ts

generate-sitemap:
	$(NODE_BIN)next-sitemap

## install
install:
	pnpm i --frozen-lockfile

## env
copy-env:
	$(VITE_NODE) script/env/copy.ts ${arguments}

development:
	make copy-env arguments="-- --development"

staging:
	make copy-env arguments="-- --staging"

production:
	make copy-env arguments="-- --productions"

testing:
	make copy-env arguments="-- --testing"

## deploy
deploy-staging: clear-cache staging
	vercel

deploy-production: clear-cache production
	vercel --prod

## dev
next=$(NODE_BIN)next

clear-cache:
	rm -rf .next

## start
start:
	$(NEXT) start $(arguments)

start-development: clear-cache
	$(NEXT) dev

start-production: start

## deployment
vercel-staging: staging
	vercel

vercel-production: production
	vercel --prod

## build
build-development: clear-cache check-projects-image-asset development build

build-production: clear-cache check-projects-image-asset production build

build-testing: clear-cache check-projects-image-asset testing build

build:
	$(NEXT) build && make generate-sitemap && make generate-webmanifest

## format
prettier=$(NODE_BIN)prettier
prettify:
	$(prettier) --ignore-path .gitignore --$(type) src/ test/

format-check:
	make prettify type=check

format:
	make prettify type=write

## lint
lint:
	$(NODE_BIN)eslint src/ test/ -f='stylish' --color &&\
		make find-unused-exports &&\
		make find-unimported-files

## find unused exports
find-unused-exports:
	$(NODE_BIN)find-unused-exports

## find unimported files
find-unimported-files:
	$(NODE_BIN)unimported

## typecheck
tsc=$(NODE_BIN)tsc

typecheck:
	$(tsc) -p tsconfig.json $(arguments) 

typecheck-watch:
	make typecheck arguments=--w

## test
test-type:
	$(NODE_BIN)vitest test/$(path)/**/**.test.ts

test-unit:
	make test-type path="unit"

test-integration:
	make build-testing && make test-type path="integration"

test: test-unit test-integration

## mongo setup and installation
# ref: https://www.digitalocean.com/community/tutorials/how-to-install-mongodb-on-ubuntu-20-04
install-mongo:
	$(VITE_NODE) script/mongo-setup

setup-mongo:
	sudo systemctl unmask mongod
	sudo systemctl start mongod
	sudo systemctl stop mongod
	sudo systemctl restart mongod
	mongosh < script/mongo-setup/document.js
