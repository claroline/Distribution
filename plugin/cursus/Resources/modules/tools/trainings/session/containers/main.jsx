import {connect} from 'react-redux'

import {selectors as toolSelectors} from '#/main/core/tool/store'

import {SessionMain as SessionMainComponent} from '#/plugin/cursus/tools/trainings/session/components/main'

const SessionMain = connect(
  (state) => ({
    path: toolSelectors.path(state)
  })
)(SessionMainComponent)

export {
  SessionMain
}
