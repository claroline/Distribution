import React from 'react'
import {connect} from 'react-redux'
import {Field, change} from 'redux-form'
import {tex} from './../lib/translate'
import Controls from './../components/form-controls.jsx'
import {ITEM_FORM} from './../components/item-form.jsx'

const T = React.PropTypes

let Open = props =>
<fieldset>
  <Field
    key={props.score}
    name="score"
    component={Controls.Number}
    min={0}
    label={tex('score')}
  />
  <Field
    key={props.maxLength}
    name="maxLength"
    component={Controls.Number}
    min={0}
    label={tex('open_max_length')}
  />
</fieldset>

Open.propTypes = {
  score: T.number.isRequired,
  maxLength: T.number.isRequired
}

Open = connect(
  state => ({
    state
  }),
  dispatch => ({
    changeFieldValue: (field, value) =>
      dispatch(change(ITEM_FORM, field, value))
  })
)(Open)

export {Open}
