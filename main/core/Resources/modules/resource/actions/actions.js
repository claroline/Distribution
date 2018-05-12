import {trans} from '#/main/core/translation'

// TODO : move in directory resource
const CreateAction = new ResourceAction('create', {
  type: 'modal',
  label: trans('create', {}, 'actions'),
  icon: 'fa fa-fw fa-plus',
  primary: true
}, (resourceNodes) => ({
  modal: [MODAL_RESOURCE_CREATE, {
    availableTypes: resourceNodes[0].permissions.create
  }]
}))

const DeleteAction = new ResourceAction('delete', {
  type: 'async',
  label: trans('delete', {}, 'actions'),
  icon: 'fa fa-fw fa-trash-o',
  dangerous: true,
  bulk: true
}, (resourceNodes) => ({
  confirm: {
    title: trans('resources_delete_confirm'),
    message: trans('resources_delete_message')
  }
}))

const EditAction = new ResourceAction('edit', {
  type: 'url',
  icon: 'fa fa-fw fa-pencil',
  label: trans('edit', {}, 'actions'),
  primary: true
}, (resourceNode) => ({

}))

const EditPropertiesAction = new ResourceAction('edit-properties', {
  type: 'modal',
  icon: 'fa fa-fw fa-cog',
  label: trans('edit-properties'),
  bulk: true
}, (resourceNodes) => ({
  modal: [MODAL_RESOURCE_PROPERTIES, {
    resourceNode: 1 === resourceNodes.length && resourceNodes[0],
    bulk: 1 < resourceNodes.length
  }]
}))

const EditRightsAction = new ResourceAction('edit-rights', {
  type: 'modal',
  label: trans('edit-rights'),
  bulk: true
}, (resourceNodes) => ({
  icon: 'fa fa-fw fa-lock',
  info: 'This will permits to display current state (for rights or published)',
  modal: [MODAL_RESOURCE_RIGHTS, {
    resourceNode: 1 === resourceNodes.length && resourceNodes[0],
    bulk: 1 < resourceNodes.length
  }]
}))

const ExportAction = new ResourceAction('export', {
  type: 'async',
  label: trans('download', {}, 'actions'),
  bulk: true
}, (resourceNodes) => {

})

const OpenAction = new ResourceAction('open', {
  type: 'url',
  label: trans('open', {}, 'actions'),
  primary: true
}, (resourceNodes) => ({
  icon: 'fa fa-fw fa-play',
  target: ['claro_resource_open', {
    node: resourceNodes[0].autoId,
    resourceType: resourceNodes[0].meta.type
  }]
}))
