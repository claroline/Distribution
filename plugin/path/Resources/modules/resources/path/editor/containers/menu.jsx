import {connect} from 'react-redux'

import {EditorMenu as EditorMenuComponent} from '#/plugin/path/resources/path/editor/components/menu'
import {selectors} from '#/plugin/path/resources/path/editor/store'

const EditorMenu = connect(
  (state) => ({
    steps: selectors.steps(state)
  })
)(EditorMenuComponent)

export {
  EditorMenu
}
