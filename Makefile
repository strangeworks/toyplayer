default: dev

clean:
	@rm -rf ./node_modules

dev:
	npm start

install:
	npm install

setup: clean install dev

.PHONY: build clean install setup
