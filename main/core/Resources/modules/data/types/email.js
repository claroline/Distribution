import {chain, string, email} from '#/main/core/validation'

import {TextGroup} from '#/main/core/layout/form/components/group/text-group.jsx'

const EMAIL_TYPE = 'email'

const emailDefinition = {
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
