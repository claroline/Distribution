import {t} from './../../utils/translate'
import ConfirmModal from './confirm.jsx'

const DeleteConfirmModal = props =>
  <ConfirmModal
    confirmButtonText={t('delete')}
    isDangerous={true}
    {...props}
  />

export default DeleteConfirmModal
