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

  const out3 = `{
	"host": "hexlet.io",
	"timeout": {
		"added": 20,
		"removed": 50
	},
	"proxy": {
		"removed": "123.234.53.22"
	},
	"verbose": {
		"added": true
	}\n}`;

  it('compare two JSON files', () => {
    const current = genDiff(beforeJSON, afterJSON, { format: 'default' });
    expect(current).toBe(out1);
  });

  it('compare two YAML files', () => {
    const current = genDiff(beforeYAML, afterYAML, { format: 'default' });
    expect(current).toBe(out1);
  });

  it('compare two INI files', () => {
    const current = genDiff(beforeINI, afterINI, { format: 'default' });
    expect(current).toBe(out1);
  });

  it('compare two JSON files (plain format)', () => {
    const current = genDiff(beforeJSON, afterJSON, { format: 'plain' });
    expect(current).toBe(out2);
  });

  it('compare two JSON files (json format)', () => {
    const current = genDiff(beforeJSON, afterJSON, { format: 'json' });
    expect(current).toBe(out3);
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

  const out3 = `{
	"common": {
		"setting1": "Value 1",
		"setting2": {
			"removed": "200"
		},
		"setting3": true,
		"setting6": {
			"removed": {
				"key": "value"
			}
		},
		"setting4": {
			"added": "blah blah"
		},
		"setting5": {
			"added": {
				"key5": "value5"
			}
		}
	},
	"group1": {
		"baz": {
			"added": "bars",
			"removed": "bas"
		},
		"foo": "bar"
	},
	"group2": {
		"removed": {
			"abc": "12345"
		}
	},
	"group3": {
		"added": {
			"fee": "100500"
		}
	}\n}`;
  it('compare two extended JSON files', () => {
    const current = genDiff(beforeJSON, afterJSON, { format: 'default' });
    expect(current).toBe(out1);
  });

  it('compare two extended YAML files', () => {
    const current = genDiff(beforeYAML, afterYAML, { format: 'default' });
    expect(current).toBe(out1);
  });

  it('compare two extended INI files', () => {
    const current = genDiff(beforeINI, afterINI, { format: 'default' });
    expect(current).toBe(out1);
  });

  it('compare two extended JSON files (plain format)', () => {
    const current = genDiff(beforeJSON, afterJSON, { format: 'plain' });
    expect(current).toBe(out2);
  });

  it('compare two extended JSON files (json format)', () => {
    const current = genDiff(beforeJSON, afterJSON, {format: 'json'});
    expect(current).toBe(out3);
  });
});
