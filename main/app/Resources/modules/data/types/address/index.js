import {trans} from '#/main/app/intl/translation'

import {getAddressString} from '#/main/app/data/types/address/utils'
import {AddressDisplay} from '#/main/app/data/types/address/components/display'
import {AddressInput} from '#/main/app/data/types/address/components/input'
import {AddressGroup} from '#/main/app/data/types/address/components/group'

const dataType = {
  name: 'address',
  meta: {
    creatable: false,
    icon: 'fa fa-fw fa-map-marker',
    label: trans('address', {}, 'data'),
    description: trans('address_desc', {}, 'data')
  },
  render: (raw) => getAddressString(raw),
  components: {
    group: AddressGroup,
    input: AddressInput,
    display: AddressDisplay,
    details: AddressDisplay // old
  }
}

export {
  dataType
}
