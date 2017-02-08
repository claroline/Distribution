import table from '#/main/core/_old/table'

let parameters = {}
parameters.route = {}
parameters.route.action = {}
parameters.route.normal = {'route': 'claro_admin_user_workspaces', 'parameters': {'user': window.userId }}
table.initialize(parameters)
