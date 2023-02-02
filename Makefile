.PHONY: build test all
MAKEFLAGS += --silent

all:
	make lint &&\
		make typecheck &&\
		make format-check &&\
		make test &&\
		make build

NODE_BIN=node_modules/.bin/

## install
install:
	pnpm i --frozen-lockfile

## deploy
deploy-staging: clear-cache
	cp .env.productions .env && vercel

deploy-production: clear-cache
	cp .env.productions .env && vercel --prod

## dev
next=$(NODE_BIN)next

clear-cache:
	rm -rf .next

## start
start:
	$(next) start $(arguments)

start-development: clear-cache
	$(next) dev

start-production: start

## deployment
vercel-staging: staging
	vercel

vercel-production: production
	vercel --prod

## build
build-development: clear-cache
	cp .env.development .env &&\
	$(next) build

build-production: clear-cache
	cp .env.productions .env &&\
	$(next) build

build-testing: clear-cache
	cp .env.testing .env &&\
	$(next) build

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
	node script/mongo-setup/install.js

setup-mongo:
	sudo systemctl unmask mongod
	sudo systemctl start mongod
	sudo systemctl stop mongod
	sudo systemctl restart mongod
	mongosh < script/mongo-setup/document.js
