import genDiff from '../src/'; 

describe('Simple configurations', () => {
  const beforeJSON = '__tests__/__fixtures__/json-before.json';
  const afterJSON = '__tests__/__fixtures__/json-after.json';
  const beforeYAML = '__tests__/__fixtures__/yaml-before.yml';
  const afterYAML = '__tests__/__fixtures__/yaml-after.yml';
  const beforeINI = '__tests__/__fixtures__/ini-before.ini';
  const afterINI = '__tests__/__fixtures__/ini-after.ini';

  const out1 = `{
	  host: hexlet.io
	+ timeout: 20
	- timeout: 50
	- proxy: 123.234.53.22
	+ verbose: true\n}`;

  const out2 = `Property 'timeout' was updated. From '50' to '20'
Property 'proxy' was removed
Property 'verbose' was added with value: 'true'`;


  it('compare two JSON files', () => {
    const current = genDiff(beforeJSON, afterJSON);
    expect(current).toBe(out1);
  });

  it('compare two YAML files', () => {
    const current = genDiff(beforeYAML, afterYAML);
    expect(current).toBe(out1);
  });

  it('compare two INI files', () => {
    const current = genDiff(beforeINI, afterINI);
    expect(current).toBe(out1);
  });

  it('compare two JSON files (plain format)', () => {
    const current = genDiff(beforeJSON, afterJSON, { format: 'plain' });
    expect(current).toBe(out2);
  });
});

describe('Complex configurations', () => {
  const beforeJSON = '__tests__/__fixtures__/extended-json-before.json';
  const afterJSON = '__tests__/__fixtures__/extended-json-after.json';
  const beforeYAML = '__tests__/__fixtures__/extended-yaml-before.yml';
  const afterYAML = '__tests__/__fixtures__/extended-yaml-after.yml';
  const beforeINI = '__tests__/__fixtures__/extended-ini-before.ini';
  const afterINI = '__tests__/__fixtures__/extended-ini-after.ini';

  const out1 = `{
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
	}\n}`;

  const out2 = `Property 'common.setting2' was removed
Property 'common.setting6' was removed
Property 'common.setting4' was added with value: 'blah blah'
Property 'common.setting5' was added with complex value
Property 'group1.baz' was updated. From 'bas' to 'bars'
Property 'group2' was removed
Property 'group3' was added with complex value`;

  it('compare two extended JSON files', () => {
    const current = genDiff(beforeJSON, afterJSON);
    expect(current).toBe(out1);
  });

  it('compare two extended YAML files', () => {
    const current = genDiff(beforeYAML, afterYAML);
    expect(current).toBe(out1);
  });

  it('compare two extended INI files', () => {
    const current = genDiff(beforeINI, afterINI);
    expect(current).toBe(out1);
  });

  it('compare two extended JSON files (plain format)', () => {
    const current = genDiff(beforeJSON, afterJSON, { format: 'plain' });
    expect(current).toBe(out2);
  });
});
