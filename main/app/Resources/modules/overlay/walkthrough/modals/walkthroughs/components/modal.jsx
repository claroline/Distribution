import React from 'react'
import {PropTypes as T} from 'prop-types'
import omit from 'lodash/omit'

import {trans} from '#/main/core/translation'
import {toKey} from '#/main/core/scaffolding/text/utils'
import {CallbackButton} from '#/main/app/buttons/callback/components/button'
import {Modal} from '#/main/app/overlay/modal/components/modal'

const WalkthroughsModal = props =>
  <Modal
    {...omit(props, 'walkthroughs', 'start')}
    icon="fa fa-fw fa-street-view"
    title={trans('walkthroughs')}
  >
    <div className="list-group walkthroughs-list">
      {props.walkthroughs.map(walkthrough =>
        <CallbackButton
          key={toKey(walkthrough.title)}
          className="list-group-item"
          callback={() => {
            props.fadeModal()
            props.start(walkthrough.scenario)
          }}
        >
          {walkthrough.title}
          {walkthrough.description &&
            <small>{walkthrough.description}</small>
          }
        </CallbackButton>
      )}
    </div>
  </Modal>

WalkthroughsModal.propTypes = {
  walkthroughs: T.arrayOf(T.shape({

  })),
  start: T.func.isRequired,
  fadeModal: T.func.isRequired
}

WalkthroughsModal.defaultProps = {
  walkthroughs: []
}

export {
  WalkthroughsModal
}
