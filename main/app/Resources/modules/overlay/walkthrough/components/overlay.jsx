import React, {Component} from 'react'
import {PropTypes as T} from 'prop-types'
import get from 'lodash/get'
import {Overlay, Position, Transition} from 'react-overlays'

import {addClasses, removeClasses} from '#/main/app/dom/classes'

import {WalkThroughPopover} from '#/main/app/overlay/walkthrough/components/popover'
import {WalkthroughStep as WalkthroughStepTypes} from '#/main/app/overlay/walkthrough/prop-types'

const WalkthroughPosition = props => props.position ?
  <Position
    placement={props.position.placement}
    target={document.querySelector(props.position.target)}
    shouldUpdatePosition={false}
  >
    {props.children}
  </Position>
  :
  props.children

WalkthroughPosition.propTypes = {
  children: T.node.isRequired,
  position: T.shape({
    target: T.string.isRequired,
    placement: T.oneOf(['left', 'top', 'right', 'bottom']).isRequired
  })
}

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

  addHighlight(selectors) {
    selectors.map(selector =>
      document.querySelectorAll(selector).forEach(highlightElement => addClasses(highlightElement, 'walkthrough-highlight'))
    )
  }

  removeHighlight(selectors) {
    selectors.map(selector =>
      document.querySelectorAll(selector).forEach(highlightElement => removeClasses(highlightElement, 'walkthrough-highlight'))
    )
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
            <WalkthroughPosition
              position={this.props.current.position}
            >
              <WalkThroughPopover
                {...this.props.current.content}
                className={!this.props.current.position ? 'walkthrough-popover-centered' : undefined}
                skip={this.props.skip}
                hasPrevious={this.props.hasPrevious}
                previous={this.props.previous}
                hasNext={this.props.hasNext}
                next={this.props.hasNext ? this.props.next : this.props.finish}
                restart={this.props.restart}
              />
            </WalkthroughPosition>
          }
        </div>
      </Overlay>
    )
  }
}

WalkthroughOverlay.propTypes = {
  active: T.bool.isRequired,
  current: T.shape(
    WalkthroughStepTypes.propTypes
  ),
  steps: T.arrayOf(T.shape(
    WalkthroughStepTypes.propTypes
  )).isRequired,
  hasNext: T.bool,
  hasPrevious: T.bool,
  start: T.func.isRequired,
  skip: T.func.isRequired,
  finish: T.func.isRequired,
  previous: T.func.isRequired,
  next: T.func.isRequired,
  restart: T.func.isRequired
}

WalkthroughOverlay.defaultProps = {

}

export {
  WalkthroughOverlay
}
