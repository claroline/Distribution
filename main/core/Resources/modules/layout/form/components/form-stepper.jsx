import React from 'react'
import {PropTypes as T} from 'prop-types'
import classes from 'classnames'

import {t} from '#/main/core/translation'
import {Router, Routes, NavLink, withRouter} from '#/main/core/router'

const Step = props =>
  <NavLink
    to={props.path}
    exact={props.exact}
    className={classes('form-stepper-link', {
      done: props.done
    })}
  >
    <span className="form-step-badge">{props.number}</span>
    {props.title}
  </NavLink>

Step.propTypes = {
  title: T.string.isRequired,
  number: T.number.isRequired,
  done: T.bool,
}

Step.defaultProps = {
  done: false
}

const FormStepperNav = props =>
  <nav className="form-stepper-nav">
    {props.steps.map((step, stepIndex) =>
      <Step
        {...step}
        key={stepIndex}
        number={stepIndex+1}
        done={props.activeIndex > stepIndex}
      />
    )}
  </nav>

FormStepperNav.propTypes = {
  activeIndex: T.number.isRequired,
  steps: T.array.isRequired
}

const FormStepperFooter = props =>
  <div className="form-stepper-footer">
    {props.nextStep &&
      <a
        className="btn btn-next btn-link"
        href={`#${props.nextStep}`}
      >
        {t('form_next_step')}
        <span className="fa fa-angle-double-right" />
      </a>
    }

    <button
      className="btn btn-submit btn-primary"
      onClick={() => this.onCreate()}
    >
      <span className="fa fa-user-plus" />
      {t('registration_confirm')}
    </button>
  </div>

FormStepperFooter.propTypes = {
  nextStep: T.string
}

const FormStepperComponent = withRouter(props => {
  let activeIndex = props.steps.findIndex(step => props.location && step.path === props.location.pathname)
  if (-1 === activeIndex) {
    activeIndex = 0
  }

  return (
    <div className="form-stepper">
      <FormStepperNav
        steps={props.steps}
        activeIndex={activeIndex}
      />

      <Routes
        routes={props.steps}
        redirect={props.redirect}
      />

      <FormStepperFooter
        nextStep={props.steps[activeIndex+1] ? props.steps[activeIndex+1].path : undefined}
      />
    </div>
  )
})

FormStepperComponent.propTypes = {
  blockingSteps: T.bool,
  steps: T.arrayOf(T.shape({
    // Route type
    path: T.string.isRequired
  })).isRequired,
  redirect: T.arrayOf(T.shape({
    // Redirect type
  }))
}

const FormStepper = props =>
  <Router>
    <FormStepperComponent {...props} />
  </Router>

FormStepper.propTypes = {
  blockingSteps: T.bool,
  steps: T.arrayOf(T.shape({
    // Route type
  })).isRequired,
  redirect: T.arrayOf(T.shape({
    // Redirect type
  }))
}

FormStepper.defaultProps = {
  blockingSteps: false
}

export {
  FormStepper
}
