import {TextGroup} from '#/main/core/layout/form/components/group/text-group.jsx'

const STRING_TYPE = 'string'

const stringDefinition = {
  // nothing special to do
  parse: (display) => display,
  // nothing special to do
  render: (raw) => raw,
  validate: (value) => typeof value === 'string',
  components: {
    form: TextGroup
  }
}

export {
  STRING_TYPE,
  stringDefinition
}
