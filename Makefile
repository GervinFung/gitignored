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

## dev
next=$(NODE_BIN)next

clear-cache:
	rm -rf .next

start-development: clear-cache
	$(next) dev

start-production: clear-cache
	$(next) start

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
	cp .env.production .env &&\
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
test:
	$(NODE_BIN)vitest

## mongo setup and installation
# ref: https://www.digitalocean.com/community/tutorials/how-to-install-mongodb-on-ubuntu-20-04
install-mongo:
	node script/mongo-setup/install.js

setup-mongo:
	sudo systemctl start mongod
	sudo systemctl stop mongod
	sudo systemctl restart mongod
	mongosh < script/mongo-setup/document.js
