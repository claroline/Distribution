import {tval} from '#/main/app/intl/translation'

import {FilterInput} from '#/main/app/data/types/filter/components/input'

const dataType = {
  name: 'filter',

  // todo : check value.value is valid against the property type
  validate: (value, options) => {
    if (value) {
      if (!value.property) {
        return tval('This filter should have a name.')
      }

      if (value.property && -1 === options.properties.findIndex(prop => prop.alias ? value.property === prop.alias : value.property === prop.name)) {
        return tval('This filter should use a filterable property.')
      }

      if (undefined === value.value) {
        return tval('This filter should have a value.')
      }
    }
  },

  components: {
    input: FilterInput
  }
}

export {
  dataType
}
