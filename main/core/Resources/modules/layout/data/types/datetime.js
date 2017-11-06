
const DATETIME_TYPE = 'datetime'

const datetimeDefinition = {
  // nothing special to do
  parse: (display) => display,
  // nothing special to do
  render: (raw) => raw,
  validate: (value) => typeof value === 'string'
}

export {
  DATETIME_TYPE,
  datetimeDefinition
}