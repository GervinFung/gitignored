.PHONY: build test all
MAKEFLAGS += --silent

all:
	make lint &&\
		make typecheck &&\
		make format-check &&\
		make test &&\
		make build

NODE_BIN=node_modules/.bin/
GATSBY=$(NODE_BIN)gatsby

## development
start:
	export NODE_ENV=development
	$(GATSBY) clean && make generate-gatsby-config && $(GATSBY) develop

## generate gatsby config file
generate-gatsby-config:
	node script/generate-gatsby-config.js

## build
build:
	make generate-gatsby-config && $(GATSBY) build

## serve
serve:
	$(GATSBY) serve

## test
test:
	export NODE_ENV=test
	$(NODE_BIN)esbuild test/index.ts --bundle --minify --target=node16.3.1 --platform=node --outfile=__tests__/index.test.js &&\
		$(NODE_BIN)jest __tests__

## type-check
typecheck:
	$(NODE_BIN)tsc -p tsconfig.json --noEmit

## format
prettier=$(NODE_BIN)prettier
prettify-src:
	$(prettier) --$(type) src/

prettify-test:
	$(prettier) --$(type) test/

format-check:
	(trap 'kill 0' INT; make prettify-src type=check & make prettify-test type=check)

format:
	(trap 'kill 0' INT; make prettify-src type=write & make prettify-test type=write)

## lint
eslint=$(NODE_BIN)eslint
lint-src:
	$(eslint) src/** -f='stylish' --color

lint-test:
	$(eslint) test/** -f='stylish' --color

lint:
	(trap 'kill 0' INT; make lint-src & make lint-test)

#ref: https://www.digitalocean.com/community/tutorials/how-to-use-the-mongodb-shell
#ref: https://stackoverflow.com/questions/23943651/mongodb-admin-user-not-authorized
#https://www.mongodb.com/docs/manual/reference/method/db.createCollection/
