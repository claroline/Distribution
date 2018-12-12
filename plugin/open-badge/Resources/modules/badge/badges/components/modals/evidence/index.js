/**
 * Workspace Parameters modal.
 * Displays a form to configure the workspace.
 */

import {registry} from '#/main/app/modals/registry'

// gets the modal component
import {EvidenceModal} from '#/main/core/workspace/modals/parameters/containers/modal'

const MODAL_BADGE_EVIDENCE = 'MODAL_BADGE_EVIDENCE'

// make the modal available for use
registry.add(MODAL_BADGE_EVIDENCE, EvidenceModal)

export {
  MODAL_BADGE_EVIDENCE
}
