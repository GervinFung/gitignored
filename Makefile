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

## install
install:
	yarn install --frozen-lockfile

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
	$(NODE_BIN)esbuild test/index.ts --sourcemap --bundle --minify --target=node16.3.1 --platform=node --outfile=__tests__/index.test.js &&\
		$(NODE_BIN)jest __tests__

## type-check
typecheck:
	$(NODE_BIN)tsc -p tsconfig.json --noEmit $(arguments)

typecheck-watch:
	make typecheck arguments=--watch

## format
prettier=$(NODE_BIN)prettier
prettify:
	$(prettier) --$(type) src/ test/

format-check:
	make prettify type=check

format:
	make prettify type=write

## lint
lint:
	$(NODE_BIN)eslint src/ test/ -f='stylish' --color

## mongo setup and installation
# ref: https://www.digitalocean.com/community/tutorials/how-to-install-mongodb-on-ubuntu-20-04
install-mongo:
	sudo apt-get install gnupg
	wget -qO - https://www.mongodb.org/static/pgp/server-5.0.asc | sudo apt-key add -
	echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/5.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-5.0.list
	sudo apt-get update
	sudo apt-get install -y mongodb-org

setup-mongo:
	sudo systemctl start mongod
	sudo systemctl stop mongod
	sudo systemctl restart mongod
	mongosh < script/ci-cd/mongo-setup.js
