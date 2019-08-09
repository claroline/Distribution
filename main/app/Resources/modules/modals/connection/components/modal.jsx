import React, {Component} from 'react'
import {PropTypes as T} from 'prop-types'
import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'
import omit from 'lodash/omit'

import {trans} from '#/main/app/intl/translation'
import {asset} from '#/main/app/config/asset'
import {Modal} from '#/main/app/overlays/modal/components/modal'
import {Button} from '#/main/app/action/components/button'
import {CALLBACK_BUTTON} from '#/main/app/buttons'
import {HtmlText} from '#/main/core/layout/components/html-text'
import {Checkbox} from '#/main/app/input/components/checkbox'

import {constants} from '#/main/core/administration/parameters/main/constants'
import {ConnectionMessage as ConnectionMessageTypes} from '#/main/core/administration/parameters/main/prop-types'

class ConnectionModal extends Component {
  constructor(props) {
    super(props)

    this.state = {
      current: 0,
      currentSlide: 0,
      discard: false
    }

    this.next = this.next.bind(this)
    this.previous = this.previous.bind(this)
    this.finish = this.finish.bind(this)
  }

  next() {
    this.setState({
      currentSlide: this.state.currentSlide + 1
    })
  }

  previous() {
    this.setState({
      currentSlide: this.state.currentSlide - 1
    })
  }

  finish() {
    const message = this.props.messages[this.state.current]
    // mark message as read
    if (!this.props.noDiscard && (constants.MESSAGE_TYPE_ONCE === message.type || (constants.MESSAGE_TYPE_DISCARD === message.type && this.state.discard))) {
      this.props.discard(message.id)
    }

    if (this.state.current === this.props.messages.length - 1) {
      // no more message to display, close the modal
      this.props.fadeModal()
    } else {
      // go next and reset slider
      this.setState({
        current: this.state.current + 1,
        currentSlide: 0,
        discard: false
      })
    }
  }

  render() {
    const message = this.props.messages[this.state.current] || {}
    const slide = get(message, `slides[${this.state.currentSlide}]`)

    return (
      <Modal
        {...omit(this.props, 'messages', 'discard', 'noDiscard')}
        className="connection-message-modal"
        title={message.title}
        subtitle={trans('current_of_total', {current: this.state.currentSlide + 1, total: message.slides.length})}
        bsSize="lg"
      >
        {!isEmpty(slide.poster) &&
          <img className="img-responsive" src={asset(slide.poster.url)} />
        }

        {slide.title &&
          <h1 className="slide-header h2">
            {slide.title}
          </h1>
        }

        {slide.content &&
          <HtmlText className="modal-body">
            {slide.content}
          </HtmlText>
        }


        <div className="modal-footer">
          {constants.MESSAGE_TYPE_DISCARD === message.type &&
            <Checkbox
              id="hide-connection-message"
              label={trans('do_not_display_anymore')}
              checked={this.state.discard}
              disabled={this.props.noDiscard}
              onChange={() => this.setState({discard: !this.state.discard})}
            />
          }

          {1 < message.slides.length &&
            <Button
              className="btn-link btn-emphasis"
              type={CALLBACK_BUTTON}
              icon="fa fa-angle-double-left"
              label=""
              disabled={0 === this.state.currentSlide}
              primary={true}
              callback={this.previous}
            />
          }

          {message.slides.length - 1 !== this.state.currentSlide &&
            <Button
              className="btn btn-emphasis"
              type={CALLBACK_BUTTON}
              label={trans('next')}
              primary={true}
              callback={this.next}
            >
              <span className="fa fa-angle-double-right icon-with-text-left" aria-hidden="true" />
            </Button>
          }

          {message.slides.length - 1 === this.state.currentSlide &&
            <Button
              className="btn btn-emphasis"
              type={CALLBACK_BUTTON}
              label={trans('close', {}, 'actions')}
              primary={true}
              callback={this.finish}
            />
          }
        </div>
      </Modal>
    )
  }
}


ConnectionModal.propTypes = {
  fadeModal: T.func.isRequired,
  messages: T.arrayOf(T.shape(
    ConnectionMessageTypes.propTypes
  )).isRequired,
  noDiscard: T.bool, // do not send discard request (mostly for preview mode)
  discard: T.func.isRequired
}

ConnectionModal.defaultProps = {
  noDiscard: false
}

export {
  ConnectionModal
}
