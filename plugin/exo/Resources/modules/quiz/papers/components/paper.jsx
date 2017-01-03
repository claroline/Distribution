import React, {PropTypes as T} from 'react'
import {connect} from 'react-redux'
import Panel from 'react-bootstrap/lib/Panel'
import {tex} from './../../../utils/translate'
import {getDefinition} from './../../../items/item-types'
import {selectors} from './../selectors'

let Paper = props =>
  <div>
    <h3>
      {tex('correction')}&nbsp;{props.paper.number}
    </h3>
    <hr/>
    {props.paper.steps.map((step, idx) =>
      <div key={idx}>
        <h4>{tex('step')}&nbsp;{idx + 1}</h4>
        {step.items.map(item =>
          <Panel key={item.id} header={item.content}>
            {React.createElement(
              getDefinition(item.type).paper,
              {item}
            )}
          </Panel>
        )}
      </div>
    )}
  </div>

Paper.propTypes = {
  paper: T.shape({
    id: T.string.isRequired,
    number: T.number.isRequired,
    steps: T.arrayOf(T.shape({
      items: T.arrayOf(T.shape({
        id: T.string.isRequired,
        content: T.string.isRequired,
        type: T.string.isRequired
      })).isRequired
    })).isRequired
  }).isRequired
}

function mapStateToProps(state) {
  return {
    paper: selectors.currentPaper(state)
  }
}

const ConnectedPaper = connect(mapStateToProps)(Paper)

export {ConnectedPaper as Paper}
