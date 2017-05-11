import isBoolean from 'lodash/isBoolean'

import {t} from '#/main/core/translation'

import {BooleanSearch} from '#/main/core/layout/data/types/components/boolean.jsx'

export const BOOLEAN_TYPE = 'boolean'

export const booleanDefinition = {
  // nothing special to do
  parse: (display) => parseBool(display),
  // nothing special to do
  render: (raw) => raw,

  // it allows boolean string
  validate: (value) => {
    try {
      parseBool(value)

      return true
    } catch (e) {
      return false
    }
  },
  components: {
    display: null,
    form: null,
    table: null,
    search: BooleanSearch
  }
}

export function parseBool(value) {
  if (isBoolean(value)) {
    return value
  } else if (typeof value === 'string') {
    switch (value.toLowerCase().trim()) {
      case '1':
      case 'true':
      case t('true'):
      case 'yes':
      case t('yes'):
        return true
      case '0':
      case 'false':
      case t('false'):
      case 'no':
      case t('no'):
        return false
    }
  }

  throw new Error('Invalid boolean value.')
}
