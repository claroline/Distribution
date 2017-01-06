import React, {PropTypes as T} from 'react'

import {tex, transChoice} from './../../../utils/translate'

const UsedHint = props =>
  <div className="well well-sm">
    <span className="fa fa-fw fa-eye fa-lightbulb-o"></span>
    {props.value}
  </div>

UsedHint.propTypes = {
  value: T.string.isRequired
}

const Hint = props =>
  <button type="button" className="btn btn-default btn-block">
    <span className="fa fa-fw fa-eye"></span>
    {tex('hint_show')}

    {props.penalty &&
    <small className="text-danger">
      {transChoice('hint_penalty', props.penalty, {count: props.penalty}, 'ujm_exo')}
    </small>
    }
  </button>

Hint.propTypes = {
  penalty: T.number,
  showHint: T.func.isRequired
}

const Hints = props =>
  <div className="item-hints">
    {props.hints.map((hint, index) =>
      <Hint
        key={index}
        penalty={hint.penalty}
        showHint={() => props.showHint(hint)}
      />
    )}
  </div>

Hints.propTypes = {
  hints: T.arrayOf(T.shape({
    id: T.string.isRequired,
    penalty: T.number
  })).isRequired,
  showHint: T.func.isRequired
}

const ItemPlayer = props =>
  <div className="item-player">
    {props.item.title &&
      <h3 className="h4 item-title">
        {props.item.title}
      </h3>
    }
    {props.item.description &&
      <div className="item-description" dangerouslySetInnerHTML={{__html: props.item.description}}></div>
    }
    <div className="item-content"  dangerouslySetInnerHTML={{__html: props.item.content}}></div>

    <hr/>
    {props.children}
    <hr/>

    {props.item.hints && 0 !== props.item.hints.length &&
      <Hints hints={props.item.hints} showHint={props.showHint} />
    }
  </div>

ItemPlayer.propTypes = {
  item: T.shape({
    title: T.string.isRequired,
    description: T.string.isRequired,
    content: T.string.isRequired,
    hints: T.array
  }).isRequired,
  showHint: T.func.isRequired,
  children: T.node.isRequired
}

export {ItemPlayer}
