/* global document */

import React, {Component} from 'react'
import {PropTypes as T} from 'prop-types'
import get from 'lodash/get'
import isEqual from 'lodash/isEqual'

import {Overlay, Position, Transition} from 'react-overlays'

import {addClasses, removeClasses} from '#/main/app/dom/classes'

import {WalkThroughStep} from '#/main/app/overlay/walkthrough/components/step'
import {WalkThroughEnd} from '#/main/app/overlay/walkthrough/components/end'
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
  constructor(props) {
    super(props)

    this.doUserAction = this.doUserAction.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    let scrollTo
    // scroll to the correct UI element if needed
    const nextPosition = get(nextProps, 'current.position')
    if (nextPosition) {
      // scroll to the popover position
      if (!isEqual(nextPosition, get(this.props, 'current.position'))) {
        // scroll to the new position
        scrollTo = nextPosition.target
      }
    } else {
      // scroll to the first highlighted
      scrollTo = get(nextProps, 'current.highlight')
    }

    if (scrollTo) {
      // TODO : find a way to enable smooth scrolling (as is the popover position will be wrong because it's calculated before end of scroll)
      document.querySelector(scrollTo).scrollIntoView({/*behavior: 'smooth'*/})
    }

    // updates highlighted components
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

    // handle next step
    const requiredInteraction = get(this.props, 'current.requiredInteraction')
    const nextRequiredInteraction = get(nextProps, 'current.requiredInteraction')
    if (requiredInteraction !== nextRequiredInteraction) {
      if (requiredInteraction) {
        document.querySelector(requiredInteraction.target).removeEventListener(requiredInteraction.type, this.doUserAction)
      }

      if (nextRequiredInteraction) {
        document.querySelector(nextRequiredInteraction.target).addEventListener(nextRequiredInteraction.type, this.doUserAction)
      }
    }
  }

  doUserAction() {
    // FIXME
    setTimeout(this.props.next, 500)
  }

  componentWillUnmount() {
    // remove highlight if any
    if (get(this.props, 'current.highlight')) {
      this.removeHighlight(get(this.props, 'current.highlight'))
    }

    // remove next handler if any
    const requiredInteraction = get(this.props, 'current.requiredInteraction')
    if (requiredInteraction) {
      document.querySelector(requiredInteraction.target).removeEventListener(requiredInteraction.type, this.doUserAction)
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
              {this.props.hasNext ?
                <WalkThroughStep
                  {...this.props.current.content}
                  className={!this.props.current.position ? 'walkthrough-popover-centered' : undefined}
                  requiredInteraction={this.props.current.requiredInteraction}
                  progression={this.props.progression}
                  skip={this.props.skip}
                  hasPrevious={this.props.hasPrevious}
                  previous={this.props.previous}
                  next={this.props.next}
                /> :
                <WalkThroughEnd
                  {...this.props.current.content}

                  additional={this.props.additional}
                  start={this.props.start}
                  finish={this.props.finish}
                  restart={this.props.restart}
                />
              }
            </WalkthroughPosition>
          }
        </div>
      </Overlay>
    )
  }
}

WalkthroughOverlay.propTypes = {
  active: T.bool.isRequired,
  progression: T.number,
  current: T.shape(
    WalkthroughStepTypes.propTypes
  ),
  hasNext: T.bool,
  hasPrevious: T.bool,
  skip: T.func.isRequired,
  finish: T.func.isRequired,
  previous: T.func.isRequired,
  next: T.func.isRequired,
  start: T.func.isRequired,
  restart: T.func.isRequired,
  additional: T.array
}

WalkthroughOverlay.defaultProps = {

}

export {
  WalkthroughOverlay
}
