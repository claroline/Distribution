import {trans} from '#/main/core/translation'

const compilatioValue = 0

const toolTypes = [
  {
    type: compilatioValue,
    name: trans('compilatio', {}, 'dropzone'),
    icon: 'fa fa-copy'
  }
]

export const constants = {
  compilatioValue,
  toolTypes
}