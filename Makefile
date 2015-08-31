default: dev

build:
	@npm run build

clean:
	@rm -rf ./node_modules

dev:
	npm start

install:
	npm install

setup: clean install build

.PHONY: build clean install setup
