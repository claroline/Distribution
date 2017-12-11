import {t} from '#/main/core/translation'
import {chain, number, inRange} from '#/main/core/validation'

import {NumberGroup} from '#/main/core/layout/form/components/group/number-group.jsx'

const NUMBER_TYPE = 'number'

const numberDefinition = {
  meta: {
    creatable: true,
    icon: 'fa fa-fw fa fa-calculator',
    label: t('number'),
    description: t('number_desc')
  },

  // nothing special to do
  parse: (display) => parseFloat(display),
  // nothing special to do
  render: (raw) => raw+'', // transtyping to string permits to avoid React interpret 0 value as falsy and display nothing
  validate: (value, options) => chain(value, options, [number, inRange]),
  components: {
    form: NumberGroup
  }
}

export {
  NUMBER_TYPE,
  numberDefinition
}
