const isAnon = state => state.isAnon
const canEdit = state => state.canEdit
const params = state => state.resource.details
const canSearchEntry = params['search_enabled'] || canEdit || !isAnon
const visibleFields = state => state.fields.filter(f => !f.hidden)
const template = state => state.resource.template
const useTemplate = state => state.resource.details['use_template']
const getParam = (state, property) => state.resource.details[property]
const isCurrentEntryOwner = state => {
  return state.currentEntry && state.currentEntry.user && state.user && state.currentEntry.user.id === state.user.id
}

export const selectors = {
  canEdit,
  isAnon,
  params,
  canSearchEntry,
  visibleFields,
  template,
  useTemplate,
  getParam,
  isCurrentEntryOwner
}