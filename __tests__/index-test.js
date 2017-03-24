import genDiff from '../src/'; 

const out1 = `{
	  host: hexlet.io
	+ timeout: 20
	- timeout: 50
	- proxy: 123.234.53.22
	+ verbose: true
}`;

const out2 = `{
	  common: {
		  setting1: Value 1
		- setting2: 200
		  setting3: true
		- setting6: {
			  key: value
		}
		+ setting4: blah blah
		+ setting5: {
			  key5: value5
		}
	}
	  group1: {
		+ baz: bars
		- baz: bas
		  foo: bar
	}
	- group2: {
		  abc: 12345
	}
	+ group3: {
		  fee: 100500
	}
}`;

test('compare two JSON files', () => {
  const path1 = '__tests__/__fixtures__/json-before.json';
  const path2 = '__tests__/__fixtures__/json-after.json';
  const current = genDiff(path1, path2);
  expect(current).toBe(out1);
});

test('compare two YAML files', () => {
  const path1 = '__tests__/__fixtures__/yaml-before.yml';
  const path2 = '__tests__/__fixtures__/yaml-after.yml';
  const current = genDiff(path1, path2);
  expect(current).toBe(out1);
});

test('compare two INI files', () => {
  const path1 = '__tests__/__fixtures__/ini-before.ini';
  const path2 = '__tests__/__fixtures__/ini-after.ini';
  const current = genDiff(path1, path2);
  expect(current).toBe(out1);
});

test('compare two extended JSON files', () => {
  const path1 = '__tests__/__fixtures__/extended-json-before.json';
  const path2 = '__tests__/__fixtures__/extended-json-after.json';
  const current = genDiff(path1, path2);
  expect(current).toBe(out2);
});

test('compare two extended YAML files', () => {
  const path1 = '__tests__/__fixtures__/extended-yaml-before.yml';
  const path2 = '__tests__/__fixtures__/extended-yaml-after.yml';
  const current = genDiff(path1, path2);
  expect(current).toBe(out2);
});

test('compare two extended INI files', () => {
  const path1 = '__tests__/__fixtures__/extended-ini-before.ini';
  const path2 = '__tests__/__fixtures__/extended-ini-after.ini';
  const current = genDiff(path1, path2);
  expect(current).toBe(out2);
});
