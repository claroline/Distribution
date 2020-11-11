import {connect} from 'react-redux'

import {selectors as toolSelectors} from '#/main/core/tool/store'
import {selectors as formSelectors} from '#/main/app/content/form/store'

import {MaterialForm as MaterialFormComponent} from '#/plugin/booking/tools/booking/material/components/form'
import {selectors} from '#/plugin/booking/tools/booking/material/store'

const MaterialForm = connect(
  (state) => ({
    path: toolSelectors.path(state),
    material: formSelectors.data(formSelectors.form(state, selectors.FORM_NAME))
  })
)(MaterialFormComponent)

export {
  MaterialForm
}
