import React, {Component, PropTypes as T} from 'react'
import {t} from './../../utils/translate'
import {Textarea} from './../../components/form/textarea.jsx'
import {FormGroup} from './../../components/form/form-group.jsx'
import {actions} from './editor'

export class Cloze extends Component {
  constructor(props) {
    super(props)
    this.selection = null
    this.fnTextUpdate = () => {}
  }

  onSelect(selection, cb) {
    this.selection = selection
    this.fnTextUpdate = cb
  }

  addHole() {
    return actions.addHole(this.selection, this.fnTextUpdate.bind(this))
  }

  render() {
    return(
      <div>
        <FormGroup controlId="cloze-text" label={t('text')}>
          <Textarea
            id={this.props.item.id}
            onChange={(value) => this.props.onChange(actions.updateText(value))}
            onSelect={this.onSelect.bind(this)}
            content={this.props.item._text}
          />
        </FormGroup>
        <button type="button" onClick={() => this.props.onChange(this.addHole())}> Create Cloze </button>
      </div>
    )
  }
}

Cloze.propTypes = {
  item: T.shape({
    id: T.string.isRequired,
    text: T.string.isRequired,
    _text: T.string.isRequired
  }),
  onChange: T.func.isRequired
}
