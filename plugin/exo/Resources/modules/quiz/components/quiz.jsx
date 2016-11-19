import React, {PropTypes as T} from 'react'
import {connect} from 'react-redux'
import {TopBar} from './top-bar.jsx'
import {Overview} from './../overview/overview.jsx'
import select from './../selectors'

let Quiz = props =>
  <div className="exercise-container">
    <div className="panel-heading">
      <h3 className="panel-title">{props.title}</h3>
    </div>
    {props.editable &&
      <TopBar {...props}/>
    }
    <Overview/>
  </div>

Quiz.propTypes = {
  title: T.string.isRequired,
  editable: T.bool.isRequired,
  currentSection: T.string.isRequired
}

// function pageComponent(page, props) {
//   switch (page) {
//     case 'editor':
//       return <Editor {...props}/>
//     case 'overview':
//     default:
//       return <Overview {...props}/>
//   }
// }

function mapStateToProps(state) {
  return {
    title: select.title(state),
    editable: select.editable(state),
    currentSection: select.currentSection(state),
    empty: select.empty(state),
    published: select.published(state),
    created: select.created(state)
  }
}

Quiz = connect(mapStateToProps)(Quiz)

export {Quiz}
