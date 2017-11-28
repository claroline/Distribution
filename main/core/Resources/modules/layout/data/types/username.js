import {UsernameGroup} from '#/main/core/layout/form/components/group/username-group.jsx'

const USERNAME_TYPE = 'username'

// todo : handle username regex option

const usernameDefinition = {
  // nothing special to do
  parse: (display) => display,
  // nothing special to do
  render: (raw) => raw,
  validate: (value) => typeof value === 'string',
  components: {
    form: UsernameGroup
  }
}

export {
  USERNAME_TYPE,
  usernameDefinition
}
