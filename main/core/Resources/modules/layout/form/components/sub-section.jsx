import React, {Component} from 'react'
import {PropTypes as T} from 'prop-types'
import Collapse from 'react-bootstrap/lib/Collapse'

/**
 * Renders a toggleable section
 */
class SubSection extends Component {
  constructor(props) {
    super(props)

    this.state = {
      hidden: true
    }

    this.toggle = this.toggle.bind(this)
  }

  toggle() {
    this.setState({hidden: !this.state.hidden})
  }

  render() {
    return (
      <fieldset className="sub-section">
        {this.state.hidden &&
          <a role="button" className="sub-section-toggle" onClick={this.toggle}>
            <span className="fa fa-caret-right" />
            {this.props.showText}
          </a>
        }
        <Collapse in={!this.state.hidden}>
          <div>
            {this.props.children}
            <a role="button" className="sub-section-toggle" onClick={this.toggle}>
              <span className="fa fa-caret-right" />
              {this.props.hideText}
            </a>
          </div>
        </Collapse>
      </fieldset>
    )
  }
}

SubSection.propTypes = {
  /**
   * Toggle button text when the section is hidden.
   */
  showText: T.string.isRequired,
  /**
   * Toggle button text when the section is shown.
   */
  hideText: T.string.isRequired,

  /**
   * Sub-section content.
   */
  children: T.any.isRequired
}

export {
  SubSection
}
