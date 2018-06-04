import {constants} from '#/plugin/blog/resources/blog/constants.js'
import {actions} from '#/plugin/blog/resources/blog/actions.js'

function saveEnabled(formSelect, state, mode) {
  if(mode === constants.EDIT_POST){
    return formSelect.saveEnabled(formSelect.form(state, 'post_edit'))
  }else if(mode === constants.CREATE_POST){
    return formSelect.saveEnabled(formSelect.form(state, 'post_edit'))
  }else if(mode === constants.EDIT_OPTIONS){
    return formSelect.saveEnabled(formSelect.form(state, 'blog.data.options'))
  }
  return false;
}

function getCommentsNumber(canEdit, publisedNumber, unpublishedNumber) {
  return canEdit ? publisedNumber + unpublishedNumber : publisedNumber;
}

export {saveEnabled, getCommentsNumber}