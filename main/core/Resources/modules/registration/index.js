import merge from 'lodash/merge'

import {bootstrap} from '#/main/core/utilities/app/bootstrap'

// reducers
import {reducer} from '#/main/core/registration/reducer'
import {optionsReducer} from '#/main/core/registration/optionsReducer'
import {t, transChoice} from '#/main/core/translation'

import {UserRegistration} from '#/main/core/registration/components/main.jsx'

// mount the react application
bootstrap(
  '.registration-form-container',
  UserRegistration,
  {
    user: reducer,
    options: optionsReducer
  },
  (initialData) => {
    return {
      user: {errors: {}},
      options: initialData.options
    }
  }
)
