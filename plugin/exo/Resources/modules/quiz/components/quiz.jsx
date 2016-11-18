import React, {PropTypes as T} from 'react'
import {TopBar} from './top-bar.jsx'
import {Overview} from './../overview/overview.jsx'

export const Quiz = props =>
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
  page: T.string
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
