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
      color: this.props.color
    } : {
      backgroundColor: this.props.color
    }

    return (
      <span className="color-picker" style={{position:'relative'}} id={this.props.id}>
        <span
          className={classes({'fa fa-font': this.props.forFontColor})}
          role="button"
          style={style}
          onClick={() => this.setState({open: !this.state.open})}
        >
        </span>
        {this.state.open &&
          <span style={{
            position: 'absolute',
            left: '-14px',
            top: '30px'
          }}>
            <TwitterPicker
              color={this.props.color}
              colors={this.props.colors}
              onChangeComplete={color => {
                this.setState({open: false})
                this.props.onPick(color)
              }}
            />
          </span>
        }
      </span>
    )
  }
}

ColorPicker.defaultProps = {
  forFontColor: false,
  colors: ['#FF6900', '#FCB900', '#7BDCB5', '#00D084', '#8ED1FC', '#0693E3', '#ABB8C3', '#EB144C', '#FFF', '#000']
}

ColorPicker.propTypes = {
  color: T.string.isRequired,
  onPick: T.func.isRequired,
  id: T.string,
  colors: T.arrayOf(T.string),
  forFontColor: T.bool
}
