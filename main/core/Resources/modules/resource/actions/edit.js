import {trans} from '#/main/core/translation'

const action = (resourceNodes) => ({
  name: 'edit',
  type: 'link',
  icon: 'fa fa-fw fa-pencil',
  label: trans('edit', {}, 'actions'),
  primary: true,
  target: '/edit'
})

export {
  action
}
