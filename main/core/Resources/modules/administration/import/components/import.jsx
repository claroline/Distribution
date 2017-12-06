import React, {Component} from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'
import {select} from '#/main/core/administration/import/selector'
import {actions} from '#/main/core/administration/import/actions'
import has from 'lodash/has'
import {Section, Sections} from '#/main/core/layout/components/sections.jsx'

const Tabs = props =>
  <ul className="nav nav-pills nav-stacked">
    {Object.keys(props.explanation).map((key) =>
      <li role="presentation" className="active">
        <a href="#" onClick={() => props.switchTab(key)}>{key}</a>
      </li>
    )}
  </ul>

const Action = props => {
  return (<div>
    <div>{props.title}</div>
    {props.properties.map((property) => {
      return (<Field field={property}/>)
    })}
  </div>)
}

const Field = props => {
  if (has(props, 'oneOf')) {
    return <div>One of</div>
  } else {
    return(
      <div>
        <div>{props.name}</div>
        <div>{props.type}</div>
        <div>{props.description}</div>
        <div>{props.required}</div>
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
)}

const ExplainTitle = props => {console.log('title', props); return (<span>{props.title}</span>)}

const CurrentTab = props => {
  console.log(props)
  return (
    <div>
      <h3>{props.title}</h3>
      <Sections
        level={3}
        accordion={true}
        defaultOpened={true}
      >
        {Object.keys(props.explanation).map((key) =>
            <Section
              id={key}
              children={React.createElement(Explain, props.explanation[key])}
              {...props}
              title={React.createElement(ExplainTitle, {title: key})}
            />
        )}
      </Sections>
  </div>
)
}

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
              <CurrentTab
                explanation={this.props.explanation[this.props.currentTab]}
                title={this.props.currentTab}
              />
            </div>
          </div>
        )
    }
}

const ConnectedImport = connect(
  state => ({
    explanation: select.explanation(state),
    currentTab: select.currentTab(state)
  }),
  dispatch =>({
    switchTab: (key) => dispatch(actions.switchTab(key))
  })
)(Import)

export {
  ConnectedImport as Import
}
