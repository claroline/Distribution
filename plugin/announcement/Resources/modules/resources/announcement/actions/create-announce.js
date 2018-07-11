import {trans} from '#/main/core/translation'
import {MODAL_RESOURCE_CREATION} from '#/main/core/resource/modals/creation'

const action = () => ({
  name: 'create-announce',
  type: 'link',
  label: trans('add_announce', {}, 'announcement'),
  icon: 'fa fa-fw fa-plus',
  primary: true,
  target: '/add'
})

export {
  action
}
