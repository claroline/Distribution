import table from '#/main/core/_old/table'

let parameters = {}
parameters.route = {}
parameters.route.action = {}
parameters.route.normal = {
  'route': 'claro_workspace_users_of_group',
  'parameters': {
    'group': window.groupId,
    'workspace': window.workspaceId,
    'order': window.order
  }
}
parameters.route.search = {
  'route': 'claro_workspace_users_of_group_search',
  'parameters': {
    'group': window.groupId,
    'workspace': window.workspaceId,
    'order': window.order
  }
}
table.initialize(parameters)
