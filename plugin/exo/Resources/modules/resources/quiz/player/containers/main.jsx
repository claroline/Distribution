import {connect} from 'react-redux'

import {withRouter} from '#/main/app/router'

import {selectors as resourceSelectors} from '#/main/core/resource/store'

import {PlayerMain as PlayerMainComponent} from '#/plugin/exo/resources/quiz/player/components/main'
import {selectors} from '#/plugin/exo/resources/quiz/player/store'

const PlayerMain = withRouter(
  connect(
    (state) => ({
      path: resourceSelectors.path(state),
      showTitles: selectors.showTitles(state),
      numberingType: selectors.numberingType(state),
      steps: selectors.steps(state)
    })
  )(PlayerMainComponent)
)

export {
  PlayerMain
}
