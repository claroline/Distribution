import {makeFormReducer} from '#/main/core/layout/form/reducer'

const defaultState = {
  defaultRole: null, // should be ROLE_USER, but I can not get it here
  registration: {
    validation: 'email',
    auto: false,
    showOnLogin: true
  },
  login: {
    redirect: 'desktop',
  },
  anonymous: {
    captcha: true,
    emailHoneypot: true,
    profileAccess: true
  },
  restrictions: {
    accountExpiration: null
  }
}

const reducer = makeFormReducer()

export {
  reducer
}
