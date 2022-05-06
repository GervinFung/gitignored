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



## mongo setup and installation
# ref: https://www.digitalocean.com/community/tutorials/how-to-install-mongodb-on-ubuntu-20-04
install:
	sudo apt-get install gnupg
	wget -qO - https://www.mongodb.org/static/pgp/server-5.0.asc | sudo apt-key add -
	echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/5.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-5.0.list
	sudo apt-get update
	sudo apt-get install -y mongodb-org

setup:
	sudo systemctl start mongod
	sudo systemctl restart mongod
	mongosh --host 0.0.0.0:27017 < script/ci-cd/mongo-setup.js
