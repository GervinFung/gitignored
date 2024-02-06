.PHONY: build all
MAKEFLAGS += --silent

outdir=temp-dev/temp-two

generate-type-for-ci:
	make install-node-packages &&\
		make pre-dev

code-gen:
	node script/code-gen.js && make format-write

pre-dev:
	cp config/.env.development .env && make code-gen

pre-prod:
	cp config/.env.production .env && make code-gen

# cli-executable
default: pre-dev
	cargo run

help: pre-dev
	cargo run -- --help

version: pre-dev
	cargo run -- --version

show: pre-dev
	cargo run -- template --list

show-column: pre-dev
	cargo run -- template --list --column $(column)

preview: pre-dev
	cargo run -- template --preview rust node java vscode jetbrain

search: pre-dev
	cargo run -- template --search rust node java vscode jetbrain whatever

generate: pre-dev
	cargo run -- template --generate rust node java vscode jetbrain whatever ${argument}

force-generate: pre-dev
	make generate argument=--force

generate-outdir: pre-dev
	rm -rf ${outdir} && cargo run -- template --generate rust node java vscode jetbrain whatever --outdir ${outdir}

append: pre-dev
	cargo run -- template --append rust node java vscode jetbrain whatever

append-absent-outdir: pre-dev
	rm -rf ${outdir} && cargo run -- template --append rust node java vscode jetbrain whatever --outdir ${outdir}

append-existing-outdir: pre-dev
	cargo run -- template --append rust node java vscode jetbrain whatever --outdir ${outdir}

update: pre-dev
	cargo run -- template --update

# non cli-executable
typecheck:
	cargo check

build: pre-prod
	rm -rf target/release && cargo build --release

pre-test:
	rm -rf temp-test

test:
	cargo test --no-fail-fast

mid-test-dev: pre-dev pre-test test

test-dev:
	node script/test-dev.js

test-prod: pre-prod pre-test test

format-write:
	cargo fmt

format-check:
	cargo fmt --check

lint:
	cargo clippy --all-targets --all-features -- -D warnings

clean:
	rm -rf target

install-rust:
	curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs -y | sh
	
install-node-packages:
	cd script && pnpm install --frozen-lockfile

pre-publish:
	node script/publish.js pre-publish

post-publish:
	node script/publish.js post-publish

publish: pre-publish
	cargo publish $(argv) && make post-publish

package: pre-publish
	cargo package $(argv) && make post-publish