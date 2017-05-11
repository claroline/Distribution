export const select = {
  data: state => state.workspaces.data,
  totalResults: state => state.workspaces.totalResults,
  //current: state => state.pagination.current || 1,
  selected: state => state.selected,
  //pageSize: state => state.pagination.pageSize || 20,
  user: state => state.user
}
