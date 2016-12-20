import React, { Component } from 'react'

const T = React.PropTypes

export class PlayerNav extends Component {
  renderPreviousButton() {
    return (
      <button className="btn btn-default" onClick={() => this.props.navigateTo(this.props.previous)}>
        <span className="fa fa-fw fa-chevron-left"></span>
        Previous
      </button>
    )
  }

  renderNextButton() {
    return (
      <button className="btn btn-default" onClick={() => this.props.navigateTo(this.props.next)}>
        Next
        <span className="fa fa-fw fa-chevron-right"></span>
      </button>
    )
  }

  renderSubmitButton() {
    return (
      <button className="btn btn-success" onClick={this.props.submitAnswers}>
        <span className="fa fa-fw fa-check"></span>
        Validate
      </button>
    )
  }

  renderFinishButton() {
    return (
      <button className="btn btn-primary" onClick={this.props.finishAttempt}>
        <span className="fa fa-fw fa-sign-out"></span>
        Finish
      </button>
    )
  }

  render() {
    return (
      <nav className="player-nav">
        <div className="backward">
          {this.props.previous &&
            this.renderPreviousButton()
          }
        </div>

        <div className="forward">
          {this.props.next ?
            this.renderNextButton() :
            this.renderFinishButton()
          }
        </div>
      </nav>
    )
  }
}

PlayerNav.propTypes = {
  previous: T.string,
  next: T.string,
  navigateTo: T.func.isRequired,
  finishAttempt: T.func.isRequired,
  submitAnswers: T.func
}

PlayerNav.defaultProps = {
  previous: null,
  next: null
}
