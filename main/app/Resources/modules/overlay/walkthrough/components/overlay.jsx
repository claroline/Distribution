/* global document */

import React, {Component} from 'react'
import {PropTypes as T} from 'prop-types'
import get from 'lodash/get'
import isEqual from 'lodash/isEqual'

import {Overlay, Position, Transition} from 'react-overlays'
import {getOverlayContainer} from '#/main/app/overlay'
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

class Walkthrough extends Component {
  constructor(props) {
    super(props)

    this.doUserAction = this.doUserAction.bind(this)
  }

  componentDidMount() {
    if (this.props.current) {
      this.startStep(this.props.current)
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!isEqual(this.props.current, nextProps.current)) {
      if (this.props.current) {
        this.endStep(this.props.current)
      }

      if (nextProps.current) {
        this.startStep(nextProps.current)
      }
    }
  }

  componentWillUnmount() {
    if (this.props.current) {
      this.endStep(this.props.current)
    }
  }

  startStep(step) {
    // scroll to the correct UI element if needed
    let scrollTo
    if (step.position) {
      // scroll to the popover position
      scrollTo = step.position.target
    } else if (step.highlight && 0 < step.highlight.length) {
      // scroll to the first highlighted
      scrollTo = step.highlight[0]
    }

    if (scrollTo) {
      // TODO : find a way to enable smooth scrolling (as is the popover position will be wrong because it's calculated before end of scroll)
      document.querySelector(scrollTo).scrollIntoView({/*behavior: 'smooth'*/})
    }

    // set highlighted components
    if (step.highlight) {
      step.highlight.map(selector =>
        document.querySelectorAll(selector).forEach(highlightElement => addClasses(highlightElement, 'walkthrough-highlight'))
      )
    }

    // handle next step
    if (step.requiredInteraction) {
      document.querySelector(step.requiredInteraction.target).addEventListener(step.requiredInteraction.type, this.doUserAction)
    }
  }

  endStep(step) {
    // remove highlights
    if (step.highlight) {
      step.highlight.map(selector =>
        document.querySelectorAll(selector).forEach(highlightElement => removeClasses(highlightElement, 'walkthrough-highlight'))
      )
    }

    // remove next step handler
    if (step.requiredInteraction) {
      document.querySelector(step.requiredInteraction.target).removeEventListener(step.requiredInteraction.type, this.doUserAction)
    }
  }

  doUserAction() {
    // FIXME
    setTimeout(this.props.next, 500)
  }

  render() {
    return (
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
          <WalkthroughPosition position={this.props.current.position}>
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
    )
  }
}

Walkthrough.propTypes = {
  container: T.oneOfType([T.node, T.element]),
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

Walkthrough.defaultProps = {

}

const WalkthroughOverlay = props =>
  <Overlay show={props.active} container={getOverlayContainer('walkthrough')}>
    <Walkthrough {...props} />
  </Overlay>

WalkthroughOverlay.propTypes = {
  active: T.bool.isRequired
}

export {
  WalkthroughOverlay
}
