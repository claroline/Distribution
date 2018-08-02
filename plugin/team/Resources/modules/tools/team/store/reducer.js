import {makeReducer, combineReducers} from '#/main/app/store/reducer'
import {makeListReducer} from '#/main/app/content/list/store'
import {makeFormReducer} from '#/main/app/content/form/store/reducer'
import {FORM_SUBMIT_SUCCESS} from '#/main/app/content/form/store/actions'

const reducer = {
  teamParams: makeReducer({}, {
    // replaces team params data after success updates
    [FORM_SUBMIT_SUCCESS+'/teamParamsForm']: (state, action) => action.updatedData
  }),
  teamParamsForm: makeFormReducer('teamParamsForm'),
  teams: combineReducers({
    list: makeListReducer('teams.list', {}, {
      invalidated: makeReducer(false, {
        [FORM_SUBMIT_SUCCESS+'/teams.current']: () => true
      })
    }),
    current: makeFormReducer('teams.current', {}, {
      users: makeListReducer('teams.current.users'),
      managers: makeListReducer('teams.current.managers'),
      usersPicker: makeListReducer('teams.current.usersPicker')
    })
  })
}

export {
  reducer
}