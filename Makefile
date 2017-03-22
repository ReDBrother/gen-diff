install:
	npm install
start:
	npm run babel-node -- src/bin/gen-diff.js -h
publish:
	npm publish
lint:
	npm run eslint -- src

