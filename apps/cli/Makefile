.PHONY: build all
MAKEFLAGS += --silent

outdir=temp-dev/temp-two

generate-type-for-ci:
	make install-node-packages &&\
		make pre-development

code-gen:
	node script/code-gen.js && make format-write

pre-development:
	cp config/.env.development .env && make code-gen

pre-production:
	cp config/.env.production .env && make code-gen

# cli-executable
default: pre-development
	cargo run

help: pre-development
	cargo run -- --help

version: pre-development
	cargo run -- --version

open-link: pre-development
	cargo run -- --open-link

show: pre-development
	cargo run -- template --show

show-column: pre-development
	cargo run -- template --show --column $(column)

preview: pre-development
	cargo run -- template --preview rust node java vscode jetbrain

search: pre-development
	cargo run -- template --search rust node java vscode jetbrain whatever

generate: pre-development
	cargo run -- template --generate rust node java vscode jetbrain whatever ${argument}

force-generate: pre-development
	make generate argument=--force

generate-outdir: pre-development
	rm -rf ${outdir} && cargo run -- template --generate rust node java vscode jetbrain whatever --outdir ${outdir}

append: pre-development
	cargo run -- template --append rust node java vscode jetbrain whatever

append-absent-outdir: pre-development
	rm -rf ${outdir} && cargo run -- template --append rust node java vscode jetbrain whatever --outdir ${outdir}

append-existing-outdir: pre-development
	cargo run -- template --append rust node java vscode jetbrain whatever --outdir ${outdir}

update: pre-development
	cargo run -- template --update

# non cli-executable
typecheck:
	cargo check

build-development: pre-development
	rm -rf target/release && cargo build --release

build-production: pre-production
	rm -rf target/release && cargo build --release

pre-test:
	rm -rf temp-test

test:
	cargo test --no-fail-fast

mid-test-dev: pre-development pre-test test

test-development:
	node script/test-dev.js

test-production: pre-production pre-test test

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
