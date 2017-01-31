import {makeReducer} from './../../utils/reducers'

import {
  USERS_SET,
  USERS_CLEAR
} from './../actions/users'

function setUsers(state, action) {
  return action.users
}

function clearUsers() {
  return []
}

const usersReducer = makeReducer([], {
  [USERS_SET]: setUsers,
  [USERS_CLEAR]: clearUsers
})

export default usersReducer
