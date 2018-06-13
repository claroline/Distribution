import React from 'react'
import {PropTypes as T} from 'prop-types'
import {displayDate} from '#/main/core/scaffolding/date'

const Version = props =>
  <div>
    <h2>{props.version.title}</h2>
    {props.version.meta && props.version.meta.creator &&
    <h5 className="small text-muted">[ {props.version.meta.creator.username} ({props.version.meta.creator.name}) - {displayDate(props.version.meta.createdAt, true, true)} ]</h5>
    }
    <div className="wiki-section-content" dangerouslySetInnerHTML={{__html: props.version.text}}/>
  </div>
  
Version.propTypes = {
  version: T.object.isRequired
}

export {
  Version
}