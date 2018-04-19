import {createSelector} from 'reselect'

const forum = state => state.forum
const subject = state => state.subject
const message = state => state.message

export const select = {
  forum,
  subject,
  message
}
