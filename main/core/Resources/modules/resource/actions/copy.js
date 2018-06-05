import {trans} from '#/main/core/translation'

const action = (resourceNodes) => ({
  name: 'copy',
  type: 'modal',
  icon: 'fa fa-fw fa-clone',
  label: trans('copy', {}, 'actions'),
  modal: []
})

export {
  action
}
