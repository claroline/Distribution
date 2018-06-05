import {trans} from '#/main/core/translation'

const action = (resourceNodes) => ({
  name: 'shortcuts',
  type: 'modal',
  icon: 'fa fa-fw fa-share',
  label: trans('show-shortcuts', {}, 'actions'),
  modal: []
})

export {
  action
}
