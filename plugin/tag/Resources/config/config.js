var workspaceTag = function (workspaceId) {
  return Routing.generate('claro_tag_workspace_tag_form', {workspace: workspaceId})
}

var translate = function() {
  return Translator.trans('tag_action', [], 'tag')
}

module.exports = {
  actions: [
    {
      name: translate,
      url: workspaceTag,
      type: 'administration_workspaces',
      class: 'fa fa-tags',
      options: {modal: true}
    }
  ]
}
