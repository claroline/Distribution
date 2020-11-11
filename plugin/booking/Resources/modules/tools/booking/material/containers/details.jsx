import {connect} from 'react-redux'

import {selectors as toolSelectors} from '#/main/core/tool/store'
import {selectors as detailsSelectors} from '#/main/app/content/details/store'

import {MaterialDetails as MaterialDetailsComponent} from '#/plugin/booking/tools/booking/material/components/details'
import {selectors} from '#/plugin/booking/tools/booking/material/store'

const MaterialDetails = connect(
  (state) => ({
    path: toolSelectors.path(state),
    material: detailsSelectors.data(detailsSelectors.details(state, selectors.FORM_NAME))
  })
)(MaterialDetailsComponent)

export {
  MaterialDetails
}
