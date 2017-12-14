import React, {Component} from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'
import {select} from '#/main/core/administration/import/selector'
import {actions} from '#/main/core/administration/import/actions'
import has from 'lodash/has'
import {Select} from '#/main/core/layout/form/components/field/select.jsx'
import {t} from '#/main/core/translation'
import {Form as FormComponent} from '#/main/core/data/form/components/form.jsx'
import {Routes} from '#/main/core/router'
import {actions as formActions} from '#/main/core/data/form/actions'

const Tabs = props =>
  <ul className="nav nav-pills nav-stacked">
    {Object.keys(props.explanation).map((key) =>
      <li key={key} role="presentation" className="">
        <a href={"#/import/" + key + '/none'}>{key}</a>
      </li>
    )}
  </ul>

const Field = props => {
  if (has(props, 'oneOf')) {
    return (
      <div className="panel panel-body">
        {t('one_of_field_list')} {props.oneOf.required ? t('required'): t('optional')}
        {props.oneOf.map(oneOf => <Fields properties={oneOf.properties}/>)}
      </div>
    )
  } else {
    return(
      <div className="well">
        <div>{props.name} {props.required ? t('required'): t('optional')}</div>
        <div>{props.description}</div>
      </div>
    )
  }
}

const Fields = props => {
  return (
    <div>
      {props.properties.map(prop => <Field {...prop}/> )}
    </div>
  )
}

const RoutedExplain = props => {
  const entity = props.match.params.entity
  const action = props.match.params.action
  const choices = {}
  choices['none'] = ''
  Object.keys(props.explanation[entity]).reduce((o, key) => Object.assign(o, {[key]: key}), choices)

  formActions.resetForm('transfer.import', {'action': action}, true)

  return (
    <div>
      <h3>{entity}</h3>
      <div>
        <FormComponent
          level={3}
          name="transfer.import"
          updateProp={(field, value) => props.updateProp(field, value, 'transfer.import', entity)}
          setErrors={() => {}}
          sections={[
            {
              id: 'general',
              title: t('general'),
              primary: true,
              fields: [{
                name: 'action',
                type: 'enum',
                label: t('action'),
                required: true,
                options: {
                  noEmpty: true,
                  choices: choices
                }},
                {
                  name: 'headers',
                  type: 'boolean',
                  label: t('show_headers')
                },
                {
                  file: 'file',
                  type: 'file',
                  label: t('file')
                }
              ]
            }
          ]}
        />
      </div>
      {/*
      <Select
        id="select-action"
        onChange={value => window.location.hash = '#import/' + entity + '/' + value}
        value={action}
        choices={choices}
      />*/}
      {props.explanation[entity][action] &&
        <div>
          <div> {t('import_headers')} </div>
          <Fields {...props.explanation[entity][action]} />
        </div>
      }
    </div>
  )
}

const ConnectedExplain = connect(
  state => ({explanation: select.explanation(state)}),
  dispatch =>({
    updateProp: (prop, value, form, entity) => dispatch(actions.updateProp(prop, value, form, entity))
  })
)(RoutedExplain)

const ExplainTitle = props => <span>{props.title}</span>

class Import extends Component
{
    constructor(props) {
      super(props)
    }

    render() {
        return (
          <div className="user-profile container row">
            <div className="col-md-3">
                <Tabs {...this.props}></Tabs>
            </div>
            <div className="col-md-9">
              <Routes
                routes={[{
                    path: '/import/:entity/:action',
                    exact: false,
                    component: ConnectedExplain
                  }]}
              />
            </div>
          </div>
        )
    }
}

const ConnectedImport = connect(
  state => ({explanation: select.explanation(state)}),
  dispatch =>({})
)(Import)

export {
  ConnectedImport as Import
}
