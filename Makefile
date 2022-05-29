setup: # Install node dev modules
	@npm install
.PHONY: setup

# vet
vet\:check: # Vet errors using tsc [alias: check]
	@npx tsc --strict --pretty
.PHONY: vet\:check

check: vet\:check
.PHONY: check

vet\:lint: # Check coding style for TypScript [alias: lint]
	@npm run lint
.PHONY: vet\:lint

lint: vet\:lint
.PHONY: lint

vet\:all: vet\:check vet\:lint # Check code using all vet:xxx targets [alias: vet]
.PHONY: vet\:all

vet: vet\:all
.PHONY: vet

# build
build\:development: # Build in development mode [alias: build]
	npm run build:development
.PHONY: build\:development

build\:production: # Build in production mode
	npm run build:production
.PHONY: build\:production

build: build\:development
.PHONY: build

# watch
watch\:build: # Start a process for build [alias: watch]
	@npm run watch:build
.PHONY: watch\:build

watch\:check: # Start a process for checking by tsc
	@npx tsc --strict --pretty --watch
.PHONY: watch\:check

watch\:lint: # Start a process for tslint using onchange
	@npm run watch:lint
.PHONY: watch\:lint

watch: watch\:build
.PHONY: watch

# util
clean: # Tidy up
	@rm -f dst/**/*.{css,js}*
.PHONY: clean

help: # Display this message
	@set -uo pipefail; \
	grep --extended-regexp '^[0-9a-z\:\\\%]+: ' \
		$(firstword $(MAKEFILE_LIST)) | \
		grep --extended-regexp ' # ' | \
		sed --expression='s/\([a-z0-9\-\:\ ]*\): \([a-z0-9\-\:\ ]*\) #/\1: #/g' | \
		tr --delete \\\\ | \
		awk 'BEGIN {FS = ": # "}; \
			{printf "\033[38;05;222m%-18s\033[0m %s\n", $$1, $$2}' | \
		sort
.PHONY: help
