import invariant from 'invariant'
import {makeActionCreator} from './../utils/utils'

export const UPDATE_VIEW_MODE = 'UPDATE_VIEW_MODE'

export const actions = {}

actions.updateWiewMode = makeActionCreator(UPDATE_VIEW_MODE, 'mode')
/*actions.updateWiewMode = (mode) => {
  console.log('action called')
  invariant(mode, 'view mode is mandatory')
  return {
    type: UPDATE_VIEW_MODE,
    viewMode: mode
  }
}*/

/*
actions.updateWiewMode = (mode) => {
  console.log('action called')
  invariant(mode, 'view mode is mandatory')
  return (dispatch, getState) => {
    dispatch(UPDATE_VIEW_MODE, mode)

  }
}
*/


/*
return (dispatch, getState) => {
  dispatch(actions.nextObject(select.nextObject(getState())))
  dispatch(actions.deleteItems(getState().steps[id].items.slice()))
  dispatch(actions.deleteStep(id))
}*/
