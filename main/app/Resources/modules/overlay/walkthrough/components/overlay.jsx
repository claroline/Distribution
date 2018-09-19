import React, {Component} from 'react'
import {PropTypes as T} from 'prop-types'
import get from 'lodash/get'
import {Overlay, Position, Transition} from 'react-overlays'

import {addClasses, removeClasses} from '#/main/app/dom/classes'

import {WalkThroughPopover} from '#/main/app/overlay/walkthrough/components/popover'

class WalkthroughOverlay extends Component {
  componentDidMount() {
    this.props.start(this.props.steps)

    if (get(this.props, 'current.highlight')) {
      this.addHighlight(get(this.props, 'current.highlight'))
    }
  }

  componentWillReceiveProps(nextProps) {
    const highlight = get(this.props, 'current.highlight')
    const nextHighlight = get(nextProps, 'current.highlight')

    if (highlight !== nextHighlight) {
      if (highlight) {
        this.removeHighlight(highlight)
      }

      if (nextHighlight) {
        this.addHighlight(nextHighlight)
      }
    }
  }

  componentWillUnmount() {
    if (get(this.props, 'current.highlight')) {
      this.removeHighlight(get(this.props, 'current.highlight'))
    }
  }

  addHighlight(selector) {
    document.querySelectorAll(selector).forEach(highlightElement => addClasses(highlightElement, 'walkthrough-highlight'))
  }

  removeHighlight(selector) {
    document.querySelectorAll(selector).forEach(highlightElement => removeClasses(highlightElement, 'walkthrough-highlight'))
  }

  render() {
    return (
      <Overlay show={this.props.active}>
        <div role="dialog">
          <Transition
            in={this.props.active}
            transitionAppear={true}
            className="fade"
            enteredClassName="in"
            enteringClassName="in"
          >
            <div className="walkthrough-backdrop" />
          </Transition>

          {this.props.active &&
            <Position
              placement="right"
              target={document.querySelector(this.props.current.target)}
              shouldUpdatePosition={false}
            >
              <WalkThroughPopover
                {...this.props.current}
                skip={this.props.skip}
                hasPrevious={this.props.hasPrevious}
                previous={this.props.previous}
                hasNext={this.props.hasNext}
                next={this.props.hasNext ? this.props.next : this.props.finish}
              />
            </Position>
          }
        </div>
      </Overlay>
    )
  }
}

WalkthroughOverlay.propTypes = {
  active: T.bool.isRequired,
  current: T.shape({

  }),
  hasNext: T.bool,
  hasPrevious: T.bool,
  steps: T.arrayOf(T.shape({
    target: T.string,
    highlight: T.string,
    title: T.string,
    message: T.string
  })).isRequired,

  start: T.func.isRequired,
  skip: T.func.isRequired,
  finish: T.func.isRequired,
  previous: T.func.isRequired,
  next: T.func.isRequired
}

WalkthroughOverlay.defaultProps = {

}

export {
  WalkthroughOverlay
}
