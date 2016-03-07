.PHONY: all build clean

all: build

build: node_modules lib/

clean:
	rm -rf node_modules
	rm -rf lib

lib/: bower.json
	./node_modules/bower/bin/bower install
	touch $@

lint:
	./node_modules/.bin/lfeslint .

# if package.json changes, install
node_modules: package.json
	npm install
	touch $@

package: build

test: build
	npm test
