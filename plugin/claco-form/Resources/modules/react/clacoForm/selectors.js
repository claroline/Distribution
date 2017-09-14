const isAnon = state => state.isAnon
const canEdit = state => state.canEdit
const params = state => state.resource.details
const canSearchEntry = params['search_enabled'] || canEdit || !isAnon

export const selectors = {
  canEdit,
  isAnon,
  params,
  canSearchEntry
}