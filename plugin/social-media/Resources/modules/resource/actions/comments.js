import {trans} from '#/main/core/translation'

const action = (resourceNodes) => ({
  name: 'comments',
  type: 'modal',
  icon: 'fa fa-fw fa-comments',
  label: trans('show-comments', {}, 'actions'),
  modal: []
})

export {
  action
}
