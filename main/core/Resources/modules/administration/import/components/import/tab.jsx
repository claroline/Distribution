import React, {Component} from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'
import {select} from '#/main/core/administration/import/selector'
import {actions} from '#/main/core/administration/import/actions'
import has from 'lodash/has'
import {Select} from '#/main/core/layout/form/components/field/select.jsx'
import {t} from '#/main/core/translation'
import {Routes} from '#/main/core/router'

const Tabs = props =>
  <ul className="nav nav-pills nav-stacked">
    {Object.keys(props.explanation).map((key) =>
      <li role="presentation" className="active">
        <a href={"#/import/" + key}>{key}</a>
      </li>
    )}
  </ul>

const Action = props => {
  return (
    <div>
      <div>{props.title}</div>
      {props.properties.map((property) => {
        return (<Field field={property}/>)
      })}
    </div>
  )
}

const Field = props => {
  if (has(props, 'oneOf')) {
    return (
      <div className="panel panel-body">
        {t('one_of_field_list')} {props.oneOf.required ? t('required'): t('optional')}
        {props.oneOf.map(oneOf => <Explain properties={oneOf.properties}/>)}
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

const Explain = props => {
  console.log(props)
  return (
    <div>
      {props.properties.map(prop => <Field {...prop}/> )}
    </div>
  )
}

const RoutedExplain = props => {
  const entity = props.match.params.entity
  const action = props.match.params.action

  return <Explain {...props.explanation[entity][action]}/>
}

const ConnectedExplain = connect(
  state => ({explanation: select.explanation(state)}),
  dispatch =>({})
)(RoutedExplain)

const ExplainTitle = props => <span>{props.title}</span>

const Tab = props => {
  console.log(props)
  const choices = Object.keys(props.explanation).reduce((o, key) => Object.assign(o, {[key]: key}), {})

  return (
    <div>
      <h3>{props.entity}</h3>
      <div>
        <Select
          onChange={(value) => window.location.hash = '#import/' + props.entity + '/' + value}
          choices={choices}
        />
        <div> {t('import_headers')} </div>
        <Routes
          routes={[{
              path: "/import/:entity/:action",
              exact: true,
              component: ConnectedExplain
            }]}
        />
      </div>
    </div>
  )
}

const CurrentTab = props => {
  const entity = props.match.params.entity

  return <Tab {...props} explanation={props.explanation[entity]} entity={entity}/>
}

const ConnectedCurrentTab = connect(
  state => ({explanation: select.explanation(state)}),
  dispatch =>({})
)(CurrentTab)

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
                    path: '/import/:entity',
                    exact: false,
                    component: ConnectedCurrentTab
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
