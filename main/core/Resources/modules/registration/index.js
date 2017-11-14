import merge from 'lodash/merge'

import {bootstrap} from '#/main/core/utilities/app/bootstrap'

// reducers
import {reducer} from '#/main/core/registration/reducer'
import {t, transChoice} from '#/main/core/translation'

import {UserRegistration} from '#/main/core/registration/components/main.jsx'

// mount the react application
bootstrap(
  '.registration-form-container',
  UserRegistration,
  {
      user: reducer,
  },
  (initialData) => ({
      user: {errors: {}}
  })
)
