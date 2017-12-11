import React, {Component} from 'react'
import {PropTypes as T} from 'prop-types'

import {t} from '#/main/core/translation'

import {MODAL_GENERIC_TYPE_PICKER} from '#/main/core/layout/modal'
import {MODAL_GENERATE_FIELD} from '#/main/core/data/form/generator/components/modal/generate-field.jsx'

import {TooltipButton} from '#/main/core/layout/button/components/tooltip-button.jsx'

import {FormField} from '#/main/core/data/form/components/field.jsx'
import {constants} from '#/main/core/data/form/generator/constants'

const FieldPreview = props =>
  <FormField
    {...props}
    label={props.name}
    onChange={() => true}
  />

FieldPreview.propTypes = {
  name: T.string.isRequired
}

FieldPreview.defaultProps = {
  options: {}
}

class FieldList extends Component {
  constructor(props) {
    super(props)

    this.add       = this.add.bind(this)
    this.update    = this.update.bind(this)
    this.remove    = this.remove.bind(this)
    this.removeAll = this.removeAll.bind(this)
    this.open      = this.open.bind(this)
  }

  add(newField) {
    const fields = this.props.fields.slice()

    // add
    fields.push(newField)

    this.props.onChange(fields)
  }

  update(index, field) {
    const fields = this.props.fields.slice()

    // update
    fields[index] = field

    this.props.onChange(fields)
  }

  remove(index) {
    const fields = this.props.fields.slice()

    // remove
    fields.splice(index, 1)

    this.props.onChange(fields)
  }

  removeAll() {
    this.props.onChange([])
  }

  open(field, callback) {
    this.props.showModal(MODAL_GENERATE_FIELD, {
      data: field,
      save: callback
    })
  }

  render() {
    return (
      <div className="field-list-control">
        {0 !== this.props.fields.length &&
          <button
            type="button"
            className="btn btn-sm btn-link-danger"
            onClick={this.removeAll}
          >
            {t('delete_all')}
          </button>
        }

        {0 < this.props.fields.length &&
          <ul>
            {this.props.fields.map((field, fieldIndex) =>
              <li key={fieldIndex} className="field-item">
                <FieldPreview
                  {...field}
                />

                <div className="field-item-actions">
                  <TooltipButton
                    id={`${this.props.id}-${fieldIndex}-edit`}
                    title={t('edit')}
                    className="btn-link-default"
                    onClick={() => this.open(field, (data) => {
                      this.update(fieldIndex, data)
                    })}
                  >
                    <span className="fa fa-fw fa-pencil" />
                  </TooltipButton>

                  <TooltipButton
                    id={`${this.props.id}-${fieldIndex}-delete`}
                    title={t('delete')}
                    className="btn-link-danger"
                    onClick={() => this.remove(fieldIndex)}
                  >
                    <span className="fa fa-fw fa-trash-o" />
                  </TooltipButton>
                </div>
              </li>
            )}
          </ul>
        }

        {0 === this.props.fields.length &&
          <div className="no-field-info">{this.props.placeholder}</div>
        }

        <button
          type="button"
          className="btn btn-default btn-block"
          onClick={() => this.props.showModal(MODAL_GENERIC_TYPE_PICKER, {
            title: 'Créer un nouveau champ',
            types: constants.fieldTypes,
            handleSelect: (type) => this.open({type: type.id}, (data) => {
              this.add(data)
            })
          })}
        >
          <span className="fa fa-plus icon-with-text-right"/>
          Ajouter un champ
        </button>
      </div>
    )
  }
}

FieldList.propTypes = {
  id: T.string.isRequired,
  placeholder: T.string,
  fields: T.arrayOf(T.shape({

  })),
  onChange: T.func.isRequired,
  showModal: T.func.isRequired
}

FieldList.defaultProps = {
  placeholder: 'Aucun champ n\'est associé à cette section.',
  fields: []
}

export {
  FieldList
}