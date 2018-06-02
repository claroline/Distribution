import {trans} from '#/main/core/translation'

const action = (resourceNodes) => ({
  name: 'logs',
  type: 'callback', // TODO : it will be section
  icon: 'fa fa-fw fa-line-chart',
  label: trans('show-logs', {}, 'actions'),
  callback: () => true
})

export {
  action
}
