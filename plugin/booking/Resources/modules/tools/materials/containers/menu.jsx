import {connect} from 'react-redux'

import {hasPermission} from '#/main/app/security'
import {selectors as toolSelectors} from '#/main/core/tool/store'

import {MaterialsMenu as MaterialsMenuComponent} from '#/plugin/booking/tools/materials/components/menu'

const MaterialsMenu = connect(
  (state) => ({
    editable: hasPermission('edit', toolSelectors.toolData(state))
  })
)(MaterialsMenuComponent)

export {
  MaterialsMenu
}
