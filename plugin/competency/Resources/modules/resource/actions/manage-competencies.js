import {trans} from '#/main/app/intl/translation'
import {MODAL_BUTTON} from '#/main/app/buttons'

import {MODAL_COMPETENCY_RESOURCES_LINKS} from '#/plugin/competency/modals/resources-links'

export default (resourceNodes, refresher) => ({
  name: 'manage_competencies',
  type: MODAL_BUTTON,
  icon: 'fa fa-fw fa-graduation-cap',
  label: trans('competency.associate', {}, 'competency'),
  modal: [MODAL_COMPETENCY_RESOURCES_LINKS, {
    nodeId: resourceNodes[0].id
  }]
})
