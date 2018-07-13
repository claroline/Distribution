import {trans} from '#/main/core/translation'
import {MODAL_RESOURCE_EXPLORER} from '#/main/core/resource/modals/explorer'

const action = (resourceNodes, refreshNodes) => ({
  name: 'move',
  type: 'modal',
  icon: 'fa fa-fw fa-arrows',
  label: trans('move', {}, 'actions'),
  modal: [MODAL_RESOURCE_EXPLORER, {
    title: trans('select_target_directory'),
    current: 0 < resourceNodes.length && resourceNodes[0].parent ? resourceNodes[0].parent : null,
    selectAction: (selected) => ({
      type: 'async',
      request: {
        url: ['claro_resource_action_short', {id: resourceNodes[0].id, action: 'move'}],
        request: {
          method: 'PUT',
          body: JSON.stringify({destination: selected[0]})
        },
        success: (response) => refreshNodes([selected[0], response])
      }
    }),
    filters: [{resourceType: 'directory'}]
  }]
})

export {
  action
}
