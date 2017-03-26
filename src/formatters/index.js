import defaultFormatter from './default';
import plainFormatter from './plain';
import jsonFormatter from './json';

const formatters = {
  default: defaultFormatter,
  plain: plainFormatter,
  json: jsonFormatter,
};

export default (format) => {
  const formatter = formatters[format];
  if (formatter) {
    return formatter;
  }

  throw new Error(`There is no formatter for this '${format}' format`);
};
