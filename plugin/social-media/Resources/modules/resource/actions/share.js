import {trans} from '#/main/core/translation'

const action = (resourceNodes) => ({
  name: 'share',
  type: 'modal',
  icon: 'fa fa-fw fa-share-alt',
  label: trans('share', {}, 'actions'),
  modal: []
})

export {
  action
}
