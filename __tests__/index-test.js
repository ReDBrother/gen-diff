import genDiff from '../src/'; 

const expected = `{
  host: hexlet.io
+ timeout: 20
- timeout: 50
- proxy: 123.234.53.22
+ verbose: true
}`;

test('compare two JSON files', () => {
  const path1 = '__tests__/__fixtures__/json-before.json';
  const path2 = '__tests__/__fixtures__/json-after.json';
  const current = genDiff(path1, path2);
  expect(current).toBe(expected);
});

test('compare two YAML files', () => {
  const path1 = '__tests__/__fixtures__/yaml-before.yml';
  const path2 = '__tests__/__fixtures__/yaml-after.yml';
  const current = genDiff(path1, path2);
  expect(current).toBe(expected);
});

test('compare two INI files', () => {
  const path1 = '__tests__/__fixtures__/ini-before.ini';
  const path2 = '__tests__/__fixtures__/ini-after.ini';
  const current = genDiff(path1, path2);
  expect(current).toBe(expected);
});

