.PHONY: all build

all: build

build: node_modules lib/

# if package.json changes, install
node_modules: package.json
	npm install
	touch $@

lib/: bower.json
	./node_modules/bower/bin/bower install
	touch $@

test: build
	npm test

clean:
	rm -rf node_modules
	rm -rf lib

package: build
