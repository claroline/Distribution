import {makeReducer, combineReducers} from '#/main/app/store/reducer'
import {makeListReducer} from '#/main/core/data/list/reducer'
import {makeFormReducer} from '#/main/core/data/form/reducer'
import {FORM_SUBMIT_SUCCESS} from '#/main/core/data/form/actions'

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