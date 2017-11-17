import React from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'

import {ResourceContainer} from '#/main/core/layout/resource/containers/resource.jsx'
import {Routes, Router} from '#/main/core/router'
import {Player} from './player.jsx'
import {Editor} from './editor.jsx'

const BookReference = props =>
  <ResourceContainer
    editor={{
      //opened: props.formOpened,
      open: '#/edit',
      save: {
        disabled: !props.formPendingChanges || (props.formValidating && !props.formValid),
        action: () => {}
      }
    }}
  >
    <Router>
      <Routes routes={[
        {
          path: '/',
          exact: true,
          component: Player
        },
        {
          path: '/edit',
          component: Editor
        }
      ]}/>
    </Router>
  </ResourceContainer>

BookReference.propTypes = {
  formPendingChanges: T.bool,
  formValidating: T.bool,
  formValid: T.bool
}

function mapStateToProps() {
  return {}
}

function mapDispatchToProps() {
  return {}
}

const ConnectedBookReference = connect(mapStateToProps, mapDispatchToProps)(BookReference)

export {
  ConnectedBookReference as BookReference
}
