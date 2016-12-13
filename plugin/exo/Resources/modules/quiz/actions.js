import invariant from 'invariant'

export const UPDATE_VIEW_MODE = 'UPDATE_VIEW_MODE'

export const actions = {}

actions.updateWiewMode = (mode) => {
  console.log('action called')
  invariant(mode, 'view mode is mandatory')
  return {
    viewMode: mode
  }
}
