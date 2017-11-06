import {NumberGroup} from '#/main/core/layout/form/components/group/number-group.jsx'

const NUMBER_TYPE = 'number'

const numberDefinition = {
  // nothing special to do
  parse: (display) => parseFloat(display),
  // nothing special to do
  render: (raw) => raw,
  validate: (value) => !isNaN(parseFloat(value)) && isFinite(value),
  components: {
    form: NumberGroup
  }
}

export {
  NUMBER_TYPE,
  numberDefinition
}
