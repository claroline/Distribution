import React from 'react'
import {Row, Col} from 'react-bootstrap'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'
import {Version} from '#/plugin/wiki/resources/wiki/history/components/version'

const VersionCompareComponent = props =>
  <Row className="wiki-version-compare">
    {props.compareSet.length === 2 &&
      <Col md={6}>
        <Version version={props.compareSet[0]}/>
      </Col>
    }
    {props.compareSet.length === 2 &&
      <Col md={6}>
        <Version version={props.compareSet[1]}/>
      </Col>
    }
  </Row>

VersionCompareComponent.propTypes = {
  compareSet: T.arrayOf(T.object).isRequired,
  section: T.object.isRequired
}

const VersionCompare = connect(
  state => ({
    compareSet: state.history.compareSet,
    section: state.history.currentSection
  })
)(VersionCompareComponent)

export {
  VersionCompare
}