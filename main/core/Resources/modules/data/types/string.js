import {t} from '#/main/core/translation'
import {string} from '#/main/core/validation'

import {TextGroup} from '#/main/core/layout/form/components/group/text-group.jsx'

const STRING_TYPE = 'string'

const stringDefinition = {
  meta: {
    type: STRING_TYPE,
    creatable: true,
    icon: 'fa fa-fw fa fa-font',
    label: t('string'),
    description: t('string_desc')
  },

  // nothing special to do
  parse: (display) => display,
  // nothing special to do
  render: (raw) => raw,
  validate: (value) => string(value),
  components: {
    form: TextGroup
  }
}

export {
  STRING_TYPE,
  stringDefinition
}
