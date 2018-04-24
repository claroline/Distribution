import {registerModals} from '#/main/core/layout/modal'
import {LogModal} from '#/main/core/administration/transfer/components/modal/log/components/log.jsx'

export const MODAL_LOG = 'MODAL_LOG'

registerModals([
  [MODAL_LOG, LogModal]
])
