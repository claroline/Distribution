import React, {PropTypes as T} from 'react'
import {connect} from 'react-redux'
import Panel from 'react-bootstrap/lib/Panel'
import {tex} from './../../../utils/translate'
import {getDefinition} from './../../../items/item-types'
import {selectors} from './../selectors'
import {Metadata as ItemMetadata} from './../../../items/components/metadata.jsx'

let Paper = props =>
  <div className="paper">
    <h2 className="paper-title">
      {tex('correction')}&nbsp;{props.paper.number}
    </h2>

    {props.steps.map((step, idx) =>
      <div key={idx} className="item-paper">
        <h3 className="step-title">
          {step.title ? step.title : tex('step') + ' ' + (idx + 1)}
        </h3>

        {step.items.map(item =>
          <Panel key={item.id}>
            {item.title &&
              <h4 className="item-title">{item.title}</h4>
            }

            <ItemMetadata item={item} />

            {React.createElement(
              getDefinition(item.type).paper,
              {item, answer: getAnswer(item.id, props.paper.answers)}
            )}
          </Panel>
        )}
      </div>
    )}
  </div>

Paper.propTypes = {
  paper: T.shape({
    id: T.string.isRequired,
    number: T.number.isRequired
  }).isRequired,
  steps: T.arrayOf(T.shape({
    items: T.arrayOf(T.shape({
      id: T.string.isRequired,
      content: T.string.isRequired,
      type: T.string.isRequired
    })).isRequired
  })).isRequired
}

function getAnswer(itemId, answers) {
  const answer = answers.find(answer => answer.questionId === itemId)

  return answer && answer.data ? answer.data : undefined
}

function mapStateToProps(state) {
  return {
    paper: selectors.currentPaper(state),
    steps: selectors.paperSteps(state)
  }
}

const ConnectedPaper = connect(mapStateToProps)(Paper)

export {ConnectedPaper as Paper}
