import React, {Component} from 'react'
import {connect} from 'react-redux'
import {PropTypes as T} from 'prop-types'

import {trans} from '#/main/core/translation'
import {SelectInput} from '#/main/core/layout/form/components/field/select-input.jsx'

import {Field as FieldType} from '#/plugin/claco-form/resources/claco-form/prop-types'
import {getFieldType} from '#/plugin/claco-form/resources/claco-form/utils'
import {ChoiceField} from '#/plugin/claco-form/resources/claco-form/editor/field/components/choice-field.jsx'

class ChoicesChildrenComponent  extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showFieldsWithChoices: false,
      selectedField: 0
    }
  }

  updateStateProps(property, value) {
    this.setState({[property]: value})
  }

  addChoicesFromSelectedField() {
    this.props.addChoicesFromField(this.state.selectedField, this.props.parent.index)
    this.setState({
      showFieldsWithChoices: false,
      selectedField: 0
    })
  }

  render() {
    return (
      <div className="choices-children-box row">
        <div className="col-md-1"></div>
        <div className="col-md-11">
          {this.props.choicesChildren[this.props.parent.index] && this.props.choicesChildren[this.props.parent.index].map(c =>
            <ChoiceField
              key={`choice-${this.props.parent.index}-${c.index}-${c.new ? 'new' : 'old'}`}
              fieldId={this.props.fieldId}
              choice={c}
              choicesChildren={this.props.choicesChildren}
              hasCascade={this.props.cascadeLevelMax > this.props.cascadeLevel}
              cascadeLevel={this.props.cascadeLevel}
              updateChoice={(index, property, value) => this.props.updateChoice(this.props.parent.index, index, property, value)}
              deleteChoice={(index) => this.props.deleteChoice(this.props.parent.index, index)}
              addChoiceChild={this.props.addChoice}
              updateChoiceChild={this.props.updateChoice}
              deleteChoiceChild={this.props.deleteChoice}
              addChoicesChildrenFromField={this.props.addChoicesFromField}
            />
          )}
          {this.state.showFieldsWithChoices ?
            <SelectInput
              selectMode={true}
              options={this.props.fields
                .filter(f =>
                  f.id !== this.props.fieldId &&
                  getFieldType(f.type).hasCascade &&
                  f.fieldFacet &&
                  f.fieldFacet.field_facet_choices.length > 0
                )
                .map(f => {
                  return {value: f.id, label: f.name}
                })
              }
              primaryLabel="<span class='fa fa-fw fa-plus-circle'></span>"
              secondaryLabel="<span class='fa fa-fw fa-times-circle'></span>"
              disablePrimary={!this.state.selectedField}
              typeAhead={false}
              value={this.state.selectedField}
              onChange={value => this.updateStateProps('selectedField', parseInt(value))}
              onPrimary={() => this.addChoicesFromSelectedField()}
              onSecondary={() => {
                this.updateStateProps('showFieldsWithChoices', !this.state.showFieldsWithChoices)
                this.updateStateProps('selectedField', 0)
              }}
            /> :
            <div className="input-group choices-management-buttons">
              <button
                className="btn btn-default btn-sm choices-management-btn"
                onClick={() => this.props.addChoice(this.props.parent.index)}
              >
                <span className="fa fa-fw fa-plus-circle"></span>
                &nbsp;
                {trans('add_choice', {}, 'clacoform')}
              </button>
              <button
                className="btn btn-default btn-sm choices-management-btn"
                onClick={() => this.updateStateProps('showFieldsWithChoices', !this.state.showFieldsWithChoices)}
              >
                <span className="fa fa-fw fa-bars"></span>
                &nbsp;
                {trans('copy_a_list', {}, 'clacoform')}
              </button>
            </div>
          }
        </div>
      </div>
    )
  }
}

ChoicesChildrenComponent.propTypes = {
  fieldId: T.number.isRequired,
  parent: T.shape({
    index: T.string.isRequired,
    value: T.string,
    new: T.bool.isRequired,
    category: T.number,
    error: T.string
  }).isRequired,
  choicesChildren: T.object,
  cascadeLevel: T.number.isRequired,
  cascadeLevelMax: T.number.isRequired,
  fields: T.arrayOf(T.shape(FieldType.propTypes)),
  addChoice: T.func,
  updateChoice: T.func,
  deleteChoice: T.func,
  addChoicesFromField: T.func
}

const ChoicesChildren = connect(
  (state) => ({
    cascadeLevelMax: state.cascadeLevelMax,
    fields: state.fields
  })
)(ChoicesChildrenComponent)

export {
  ChoicesChildren
}
