import program from 'commander';
import genDiff from '.';

export default () => {
  program
    .version('0.0.2')
    .arguments('<first_config> <second_config>')
    .action(genDiff);

  program
    .description('Compares two configuration files and shows a difference.')
    .option('-f, --format [type]', 'Output format', /^(plain|json)$/i, 'default')
    .parse(process.argv);
};
