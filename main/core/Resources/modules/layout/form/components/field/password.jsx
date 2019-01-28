import React, {Component} from 'react'

import {trans} from '#/main/app/intl/translation'

import {PropTypes as T, implementPropTypes} from '#/main/app/prop-types'
import {FormField as FormFieldTypes} from '#/main/core/layout/form/prop-types'

import {TooltipOverlay} from '#/main/app/overlay/tooltip/components/overlay'

class Password extends Component {
  constructor(props) {
    super(props)

    this.state = {
      visible: false
    }
  }

  setPasswordVisibility(visibility) {
    this.setState({
      visible: visibility
    })
  }

  render() {
    return (
      <div className="input-group">
        <span className="input-group-addon">
          <span className="fa fa-fw fa-lock" role="presentation" />
        </span>

        <input
          id={this.props.id}
          type={this.state.visible ? 'text':'password'}
          className="form-control"
          value={this.props.value || ''}
          disabled={this.props.disabled}
          onChange={(e) => this.props.onChange(e.target.value)}
          autoComplete={this.props.autoComplete || null}
        />

        <span className="input-group-btn">
          <TooltipOverlay
            id={`${this.props.id}-show`}
            tip={trans('show_password')}
          >
            <button
              type="button"
              role="button"
              className="btn btn-default"
              disabled={this.props.disabled}
              onMouseDown={() => this.setPasswordVisibility(true)}
              onMouseUp={() => this.setPasswordVisibility(false)}
            >
              <span className="fa fa-fw fa-eye" />
            </button>
          </TooltipOverlay>
        </span>
      </div>
    )
  }
}


implementPropTypes(Password, FormFieldTypes, {
  value: T.string
})

export {
  Password
}
