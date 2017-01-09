import React from 'react'

const T = React.PropTypes

const PreviousButton = props =>
  <button className="btn btn-previous btn-default" onClick={props.onClick}>
    <span className="fa fa-fw fa-angle-double-left"></span>
    Previous
  </button>

PreviousButton.propTypes = {
  onClick: T.func.isRequired
}

const NextButton = props =>
  <button className="btn btn-next btn-default" onClick={props.onClick}>
    Next
    <span className="fa fa-fw fa-angle-double-right"></span>
  </button>

NextButton.propTypes = {
  onClick: T.func.isRequired
}

const ValidateButton = props =>
  <button className="btn btn-next btn-default" onClick={props.onClick}>
    Validate
    <span className="fa fa-fw fa-angle-double-right"></span>
  </button>

ValidateButton.propTypes = {
  onClick: T.func.isRequired
}

const SubmitButton = props =>
  <button className="btn btn-submit btn-success" onClick={props.onClick}>
    <span className="fa fa-fw fa-check"></span>
    Validate
  </button>

SubmitButton.propTypes = {
  onClick: T.func.isRequired
}

const FinishButton = props =>
  <button className="btn btn-finish btn-primary" onClick={props.onClick}>
    <span className="fa fa-fw fa-sign-out"></span>
    Finish
  </button>

FinishButton.propTypes = {
  onClick: T.func.isRequired
}

const PlayerNav = props =>
  <nav className="player-nav">
    <div className="backward">
      {(props.previous) &&
        <PreviousButton onClick={() => props.navigateTo(props.previous)} />
      }
    </div>

    <div className="forward">
      {(props.next) ?

        (props.currentStepSend) ?
          (props.showFeedback) ?
            (!props.feedbackEnabled) ?
              <ValidateButton onClick={() => props.openFeedbackAndValidate(props.step)} /> :
              <NextButton onClick={() => props.navigateToAndValidate(props.next)} /> :
            <ValidateButton onClick={() => props.navigateToAndValidate(props.next)} /> :
          <NextButton onClick={() => props.navigateToAndValidate(props.next)} /> :

        //no next section
        (props.showFeedback) ?
          (props.currentStepSend) ?
            (!props.feedbackEnabled) ?
              <ValidateButton onClick={() => props.openFeedbackAndValidate(props.step)} /> :
              <NextButton onClick={() => props.openFeedbackAndValidate(props.step)} /> :
            <FinishButton onClick={props.finish}/> :
          <FinishButton onClick={props.finish}/>
      }
    </div>
  </nav>

PlayerNav.propTypes = {
  next: T.shape({
    id: T.string.isRequired,
    items: T.arrayOf(T.string).isRequired
  }),
  previous: T.shape({
    id: T.string.isRequired,
    items: T.arrayOf(T.string).isRequired
  }),
  step: T.shape({
    id: T.string.isRequired,
    items: T.arrayOf(T.string).isRequired
  }).isRequired,
  navigateToAndValidate: T.func.isRequired,
  navigateTo: T.func.isRequired,
  finish: T.func.isRequired,
  openFeedbackAndValidate: T.func.isRequired,
  submit: T.func.isRequired,
  showFeedback: T.bool.isRequired,
  feedbackEnabled: T.bool.isRequired,
  currentStepSend: T.bool.isRequired
}

PlayerNav.defaultProps = {
  previous: null,
  next: null
}

export {PlayerNav}
