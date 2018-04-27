import {createSelector} from 'reselect'

const forum = state => state.forum
const subject = state => state.subject
const messages = state => state.messages




export const select = {
  forum,
  subject,
  messages
}
