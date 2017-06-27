
export const COLOR_TYPE = 'color'

export const colorDefinition = {
  // nothing special to do
  parse: (display) => display,
  // nothing special to do
  render: (raw) => raw,
  validate: (value) => typeof value === 'string',
  components: {
    form: null,
    table: null
  }
}
