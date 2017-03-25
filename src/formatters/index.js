import defaultFormatter from './default';
import plainFormatter from './plain';

const formatters = {
  default: defaultFormatter,
  plain: plainFormatter,
};

export default (format) => {
  const formatter = formatters[format];
  if (formatter) {
    return formatter;
  }

  throw new Error(`There is no formatter for this '${format}' format`);
};
