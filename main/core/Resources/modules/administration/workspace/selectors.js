export const select = {
  workspaces: state => state.pager.workspaces,
  count: state => state.pager.count,
  page: state => state.pager.page || 1,
  size: state => state.pager.size || 20,
  user: state => state.user
}
