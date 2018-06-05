import {trans} from '#/main/core/translation'

const action = (resourceNodes) => ({
  name: 'import',
  type: 'modal',
  icon: 'fa fa-fw fa-upload',
  label: trans('import', {}, 'actions'),
  modal: []
})

export {
  action
}
