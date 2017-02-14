import React, {Component, PropTypes as T} from 'react'
import {TwitterPicker} from 'react-color'
import classes from 'classnames'

export class ColorPicker extends Component {
  constructor(props) {
    super(props)
    this.state = {
      open: false
    }
  }

  render() {
    let style = this.props.forFontColor ? {
      position: 'relative',
      color: this.props.color
    } : {
      position: 'relative',
      backgroundColor: this.props.color
    }

    return (
      <span className="color-picker" id={this.props.id}>
        <span
          className={classes({'fa fa-font': this.props.forFontColor})}
          role="button"
          style={style}
          onClick={() => !this.state.open && this.setState({open: !this.state.open})}
        >
          {this.state.open &&
            <span style={{
              position: 'absolute',
              left: '-14px',
              top: '30px'
            }}>
              <TwitterPicker
                color={this.props.color}
                onChangeComplete={color => {
                  this.setState({open: false})
                  this.props.onPick(color)
                }}
              />
            </span>
          }
        </span>
      </span>
    )
  }
}

ColorPicker.defaultProps = {
  forFontColor: false
}

ColorPicker.propTypes = {
  color: T.string.isRequired,
  onPick: T.func.isRequired,
  id: T.string,
  forFontColor: T.bool
}
