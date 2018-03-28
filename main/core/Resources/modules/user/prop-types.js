import {PropTypes as T} from 'prop-types'

const User = {
  propTypes: {
    id: T.string.isRequired,
    name: T.string.isRequired,
    firstName: T.string,
    lastName: T.string,
    username: T.string.isRequired,
    picture: T.shape({
      url: T.string.isRequired
    }),
    meta: T.shape({
      created: T.string,
      lastLogin: T.string,
      description: T.string,
      publicUrl: T.string,
      personalWorkspace: T.bool
    }),
    restrictions: T.shape({
      disabled: T.bool
    })
  },
  defaultProps: {
    meta: {},
    restrictions: {
      disabled: false
    }
  }
}

const Role = {
  propTypes: {
    id: T.string,
    name: T.string,
    meta: T.shape({
      users: T.number,
      readOnly: T.bool
    }),
    restrictions: T.shape({
      maxUsers: T.number
    }),
    adminTools: T.object
  },
  defaultProps: {

  }
}

const Group = {
  propTypes: {
    id: T.string,
    name: T.string
  },
  defaultProps: {

  }
}

const Organization = {
  propTypes: {
    id: T.string,
    name: T.string,
    code: T.string,
    email: T.string,
    parent: T.shape({
      id: T.string.isRequired,
      name: T.string.isRequired
    })
  },
  defaultProps: {
    parent: null
  }
}

const Location = {
  propTypes: {
    id: T.string,
    name: T.string
  },
  defaultProps: {

  }
}

export {
  User,
  Role,
  Group,
  Organization,
  Location
}
