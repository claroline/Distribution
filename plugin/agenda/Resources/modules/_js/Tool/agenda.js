import calendar from '../../calendar'

var type = window.workspaceId === 'undefined' ? 'desktop': 'workspace'
calendar.initialize(type, window.workspaceId, window.editableWorkspaces)
