import {connect} from 'react-redux'

import {withReducer} from '#/main/app/store/components/withReducer'
import {selectors as formSelectors} from '#/main/app/content/form/store/selectors'

import {PositionModal as PositionModalComponent} from '#/plugin/path/resources/path/editor/modals/position/components/modal'
import {reducer, selectors} from '#/plugin/path/resources/path/editor/modals/position/store'

const PositionModal = withReducer(selectors.STORE_NAME, reducer)(
  connect(
    (state) => ({
      positionData: formSelectors.data(formSelectors.form(state, selectors.STORE_NAME)),
      selectEnabled: formSelectors.saveEnabled(formSelectors.form(state, selectors.STORE_NAME)),
    })
  )(PositionModalComponent)
)

export {
  PositionModal
}
