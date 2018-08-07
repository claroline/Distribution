import React from 'react'
import {connect} from 'react-redux'
import {PropTypes as T} from 'prop-types'

import {PageContainer} from '#/main/core/layout/page'

import {MessagesNav} from '#/plugin/message/components/messages-nav'
import {Messages} from '#/plugin/message/components/messages'
import {selectors} from '#/plugin/message/selectors'

const MessagingComponent = (props) =>
  <PageContainer>
    <h2>{props.title}</h2>
    <div className="row">
      <div className="col-md-3">
        <MessagesNav/>
      </div>
      <div className="col-md-9">
        <Messages/>
      </div>
    </div>
  </PageContainer>

MessagingComponent.propTypes = {
  title : T.string
}

const Messaging = connect(
  state => ({
    title: selectors.title(state)
  })
)(MessagingComponent)

export {
  Messaging
}
