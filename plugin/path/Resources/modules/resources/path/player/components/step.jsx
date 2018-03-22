import React, {Component} from 'react'
import classes from 'classnames'

import {asset} from '#/main/core/scaffolding/asset'
import {url} from '#/main/core/api/router'
import {currentUser} from '#/main/core/user/current'
import {trans} from '#/main/core/translation'
import {PropTypes as T, implementPropTypes} from '#/main/core/scaffolding/prop-types'
import {HtmlText} from '#/main/core/layout/components/html-text.jsx'

import {Step as StepTypes} from '#/plugin/path/resources/path/prop-types'
import {constants} from '#/plugin/path/resources/path/constants'

class PrimaryResource extends Component {
  constructor(props) {
    super(props)

    this.resize = this.resize.bind(this)
  }

  /**
   * Resize the iFrame DOM is modified.
   *
   * @param {object} e - The JS Event Object
   */
  resize(e) {
    if (typeof e.data === 'string' && e.data.indexOf('documentHeight:') > -1) {
      // Split string from identifier
      const height = e.data.split('documentHeight:')[1]

      this.iframe.height = parseInt(height)
    }
  }

  componentDidMount() {
    window.addEventListener('message', this.resize)
  }

  componentWillUnmount() {
    window.removeEventListener('message', this.resize)
  }

  render() {
    return (
      <iframe
        id="embeddedActivity"
        ref={el => this.iframe = el}
        height={0}
        src={url(['claro_resource_open', {node: this.props.id, resourceType: this.props.type}], {iframe: 1})}
        allowFullScreen={true}
      />
    )
  }
}

PrimaryResource.propTypes = {
  id: T.number.isRequired,
  type: T.string.isRequired
}

const authenticatedUser = currentUser()

const ManualStepProgressionControl = props =>
  <div className="dropdown">
    <span
      className="dropdown-toggle step-manual-progression"
      role="button"
      data-toggle="dropdown"
      aria-haspopup={true}
      aria-expanded={true}
    >
      {trans('user_progression', {}, 'path')} : <b>{constants.STEP_STATUS[props.status]}</b> <span className="fa fa-fw fa-caret-down"/>
    </span>
    <ul className="dropdown-menu">
      <li className={classes({'active': props.status === constants.STATUS_TO_DO})}>
        <a
          className="pointer-hand"
          onClick={() => props.updateProgression(props.stepId, constants.STATUS_TO_DO)}
        >
          {constants.STEP_STATUS[constants.STATUS_TO_DO]}
        </a>
      </li>
      <li className={classes({'active': props.status === constants.STATUS_DONE})}>
        <a
          className="pointer-hand"
          onClick={() => props.updateProgression(props.stepId, constants.STATUS_DONE)}
        >
          {constants.STEP_STATUS[constants.STATUS_DONE]}
        </a>
      </li>
      <li className={classes({'active': props.status === constants.STATUS_TO_REVIEW})}>
        <a
          className="pointer-hand"
          onClick={() => props.updateProgression(props.stepId, constants.STATUS_TO_REVIEW)}
        >
          {constants.STEP_STATUS[constants.STATUS_TO_REVIEW]}
        </a>
      </li>
    </ul>
  </div>

ManualStepProgressionControl.propTypes = {
  status: T.string.isRequired,
  stepId: T.string.isRequired,
  updateProgression: T.func.isRequired
}

/**
 * Renders step content.
 */
const Step = props =>
  <div className="current-step">
    {props.poster &&
      <img className="step-poster img-responsive" alt={props.title} src={asset(props.poster.url)} />
    }

    <h3 className="h2 step-title">
      {props.numbering &&
        <span className="step-numbering">{props.numbering}</span>
      }

      {props.title}

      {props.manualProgressionAllowed && authenticatedUser &&
        <ManualStepProgressionControl
          status={props.userProgression.status}
          stepId={props.id}
          updateProgression={props.updateProgression}
        />
      }
    </h3>

    {props.description &&
      <div className="panel panel-default">
        <HtmlText className="panel-body">{props.description}</HtmlText>
      </div>
    }

    {props.primaryResource &&
      <PrimaryResource
        id={props.primaryResource.autoId}
        type={props.primaryResource.meta.type}
      />
    }
  </div>

implementPropTypes(Step, StepTypes, {
  numbering: T.string,
  manualProgressionAllowed: T.bool.isRequired,
  updateProgression: T.func.isRequired
})

export {
  Step
}
