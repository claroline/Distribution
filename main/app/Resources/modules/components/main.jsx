import React, {Fragment} from 'react'
import {PropTypes as T} from 'prop-types'
import {Provider} from 'react-redux'

import {OverlayStack} from '#/main/app/overlay/containers/stack'

// implemented overlays
import {ModalOverlay} from '#/main/app/overlay/modal/containers/overlay'
import {AlertOverlay} from '#/main/app/overlay/alert/containers/overlay'
import {WalkthroughOverlay} from '#/main/app/overlay/walkthrough/containers/overlay'

// TODO : maybe append app styles here

const Main = props =>
  <Provider store={props.store}>
    <Fragment>
      {props.children}

      <OverlayStack>
        <AlertOverlay />
        <ModalOverlay />
        <WalkthroughOverlay />
      </OverlayStack>
    </Fragment>
  </Provider>

Main.propTypes = {
  store: T.shape({

  }).isRequired,
  children: T.any
}

export {
  Main
}
