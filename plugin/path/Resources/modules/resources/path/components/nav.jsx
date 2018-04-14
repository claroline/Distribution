import React from 'react'
import {PropTypes as T} from 'prop-types'

import {trans} from '#/main/core/translation'
import {LinkButton} from '#/main/app/button/components/link'

import {Step as StepTypes} from '#/plugin/path/resources/path/prop-types'

const PathNavigation = props =>
  <nav className="path-navigation">
    {props.previous &&
      <LinkButton
        className="btn btn-link btn-lg"
        disabled={!props.previous}
        primary={true}
        target={props.previous ? `${props.prefix}/${props.previous.id}`:''}
      >
        <span className="fa fa-angle-double-left icon-with-text-right" />
        {trans('previous')}
      </LinkButton>
    }

    {props.next &&
      <LinkButton
        className="btn btn-link btn-lg"
        disabled={!props.next}
        primary={true}
        target={props.next ? `${props.prefix}/${props.next.id}`:''}
      >
        {trans('next')}
        <span className="fa fa-angle-double-right icon-with-text-left" />
      </LinkButton>
    }
  </nav>

PathNavigation.propTypes = {
  prefix: T.string.isRequired,
  previous: T.shape(
    StepTypes.propTypes
  ),
  next: T.shape(
    StepTypes.propTypes
  )
}

PathNavigation.defaultProps = {
  previous: null,
  next: null
}

export {
  PathNavigation
}
