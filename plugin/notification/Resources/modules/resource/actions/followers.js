import {trans} from '#/main/core/translation'

const action = (resourceNodes) => ({
  name: 'followers',
  type: 'modal',
  icon: 'fa fa-fw fa-users',
  label: trans('show-followers', {}, 'actions'),
  modal: []
})

export {
  action
}
