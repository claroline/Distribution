import React, {Component} from 'react'
import {Field, FieldArray, reduxForm} from 'redux-form'
import {t, tex} from './../lib/translate'
import {notBlank} from './../lib/validate'
import {makeId} from './../util'
import {properties} from './../types'
import Controls from './form-controls.jsx'

// TODO: update field names when available (specification, supplementary, etc.)
// TODO: add categories, objects, resources, define-as-model

const T = React.PropTypes
const id = (field, itemId) => `item-${itemId}-field-${field}`

export const ITEM_FORM = 'item-properties'

const Metadata = props =>
  <fieldset>
    <Field
      name="title"
      component={Controls.Text}
      label={t('title')}
    />
    <Field
      id={id('description', props.itemId)}
      name="description"
      component={Controls.Textarea}
      label={t('description')}
    />
    <Field
      id={id('instruction', props.itemId)}
      name="specification"
      component={Controls.Textarea}
      label={tex('instruction')}
    />
    <Field
      id={id('info', props.itemId)}
      name="supplementary"
      component={Controls.Textarea}
      label={tex('additional_info')}
    />
  </fieldset>

Metadata.propTypes = {
  itemId: T.string.isRequired
}

const Hint = props =>
  <div className="hint-item">
    <div className="hint-value">
      <Field
        id={`${props.name}.data`}
        name={`${props.name}.data`}
        title={tex('hint')}
        component={Controls.Textarea}
      />
    </div>
    <Field
      name={`${props.name}.penalty`}
      className="form-control hint-penalty"
      title={tex('penalty')}
      component="input"
      type="number"
      min="0"
    />
    <span
      role="button"
      title={t('delete')}
      className="fa fa-trash-o"
      onClick={props.onRemove}
    />
  </div>

Hint.propTypes = {
  name: T.string.isRequired,
  onRemove: T.func.isRequired
}

const Hints = props =>
  <div className="hint-items">
    <label
      className="control-label"
      htmlFor="hint-list"
    >
      {tex('hints')}
    </label>
    {props.fields.length === 0 &&
      <div className="no-hint-info">{tex('no_hint_info')}</div>
    }
    <ul id="hint-list">
      {props.fields.map((hint, index) =>
        <li key={hint}>
          <Hint
            name={hint}
            onRemove={() => props.fields.remove(index)}
          />
        </li>
      )}
      <div className="footer">
        <button
          type="button"
          className="btn btn-default"
          onClick={() => props.fields.push({id: makeId(), penalty: 0})}
        >
          <span className="fa fa-plus"/>
          &nbsp;{tex('add_hint')}
        </button>
      </div>
    </ul>
  </div>

Hints.propTypes = {
  fields: T.object.isRequired
}

const Interact = props =>
  <fieldset>
    <FieldArray
      name="hints"
      component={Hints}
    />
    <hr/>
    <Field
      id={id('feedback', props.itemId)}
      name="feedback"
      component={Controls.Textarea}
      label={tex('feedback')}
    />
  </fieldset>

Interact.propTypes = {
  itemId: T.string.isRequired
}

class ItemForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      metaHidden: true,
      feedbackHidden: true
    }
  }

  render() {
    return (
      <form>
        <Field
          id={id('question', this.props.id)}
          name="invite"
          component={Controls.Textarea}
          label={tex('question')}
        />
        <Controls.CollapsibleSection
          hidden={this.state.metaHidden}
          showText={tex('show_metadata_fields')}
          hideText={tex('hide_metadata_fields')}
          toggle={() => this.setState({metaHidden: !this.state.metaHidden})}
        >
          <Metadata itemId={this.props.id}/>
        </Controls.CollapsibleSection>
        <hr/>
        {this.props.children}
        <hr/>
        <Controls.CollapsibleSection
          hidden={this.state.feedbackHidden}
          showText={tex('show_interact_fields')}
          hideText={tex('hide_interact_fields')}
          toggle={() => this.setState({feedbackHidden: !this.state.feedbackHidden})}
        >
          <Interact itemId={this.props.id}/>
        </Controls.CollapsibleSection>
      </form>
    )
  }
}

ItemForm.propTypes = {
  id: T.string.isRequired,
  initialValues: T.object.isRequired,
  children: T.oneOfType([T.object, T.array]).isRequired
}

const ReduxedItemForm = reduxForm({
  form: ITEM_FORM,
  touchOnChange: true,
  validate: values => {
    const errors = {
      invite: notBlank(values.invite, true)
    }
    const typeValidate = properties[values.type].validateFormValues
    const typeErrors = typeValidate(values)

    return Object.assign(errors, typeErrors)
  }
})(ItemForm)

export {ReduxedItemForm as ItemForm}