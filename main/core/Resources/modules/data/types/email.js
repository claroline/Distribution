import {t} from '#/main/core/translation'
import {chain, string, email} from '#/main/core/validation'

import {TextGroup} from '#/main/core/layout/form/components/group/text-group.jsx'

const EMAIL_TYPE = 'email'

const emailDefinition = {
  meta: {
    type: EMAIL_TYPE,
    creatable: true,
    icon: 'fa fa-fw fa fa-at',
    label: t('email'),
    description: t('email_desc')
  },
  // nothing special to do
  parse: (display) => display,
  // nothing special to do
  render: (raw) => raw,
  validate: (value) => chain(value, {}, [string, email]),
  components: {
    form: TextGroup
  }
}

export {
  EMAIL_TYPE,
  emailDefinition
}
