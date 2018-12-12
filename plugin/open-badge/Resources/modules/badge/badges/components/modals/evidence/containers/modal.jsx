import {connect} from 'react-redux'

import {withReducer} from '#/main/app/store/components/withReducer'

import {
  actions as formActions
} from '#/main/app/content/form/store'

import {EvidenceModal as EvidenceModalComponent} from '#/main/core/badge/badges/components/modals/evidence/components/modal'
import {reducer, selectors} from '#/main/core/badge/badges/components/modals/evidence/store'

const EvidenceModal = withReducer(selectors.STORE_NAME, reducer)(
  connect(
    null,
    (dispatch) => ({
      saveEvidence(assertion) {
        dispatch(formActions.saveForm(selectors.STORE_NAME, ['apiv2_evidence_create', {assertion: assertion.id}]))
      }
    })
  )(EvidenceModalComponent)
)

export {
  EvidenceModal
}
