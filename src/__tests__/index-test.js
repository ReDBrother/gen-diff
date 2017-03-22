import genDiff from '..';

const expected = `{
  host: hexlet.io
+ timeout: 20
- timeout: 50
- proxy: 123.234.53.22
+ verbose: true
}`;

test('compare two files', () => {
  const path1 = 'src/__tests__/before.json';
  const path2 = 'src/__tests__/after.json';
  const current = genDiff(path1, path2);
  expect(current).toBe(expected);
});
