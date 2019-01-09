import {trans} from '#/main/app/intl/translation'
import {MODAL_BUTTON} from '#/main/app/buttons'

// TODO : implement

export default () => ({
  name: 'comments',
  type: MODAL_BUTTON,
  icon: 'fa fa-fw fa-comments',
  label: trans('show-comments', {}, 'actions'),
  modal: []
})
