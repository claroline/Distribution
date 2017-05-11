
export const STRING_TYPE = 'string'

export const stringDefinition = {
  // nothing special to do
  parse: (display) => display,
  // nothing special to do
  render: (raw) => raw,
  validate: (value) => typeof value === 'string',
  components: {
    display: null,
    form: null,
    table: null
  }
}
