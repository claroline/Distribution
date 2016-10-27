import React, {Component} from 'react'
import {tex, t} from './../lib/translate'

const T = React.PropTypes


class OddItem extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div className="odd-item-row">
        <div className="text-fields">
          <textarea
            className="form-control"
            value={this.props.odd.data}
            onChange={() => {}}
          />
        </div>
        <div className="right-controls">
          <a role="button" className="fa fa-trash-o"></a>
        </div>
      </div>
    )
  }
}

OddItem.propTypes = {
  odd: T.object.isRequired,
  index: T.number.isRequired
}

class PairItem extends Component {
  constructor(props) {
    super(props)
    this.state = {showFeedback: false}
  }

  makeDataFieldTitle(index, left){
    let title = tex('Paire')
    const number = index + 1
    const part = left ? '1':'2'
    title += ' ' + number + ' - ' + part + ' ' + tex('data')
    return title
  }

  render(){
    return (
      <div className="pair-item-row">
        <div className="pair-title-col">
          <label>{tex('Paire ')}&nbsp;{this.props.index +1}</label>
        </div>
        <div className="input-col">
          <div className="fields-row">
            <div className="col">
              <textarea
                className="form-control"
                value={this.props.pair.left.data}
                onChange={() => {}}
                title={this.makeDataFieldTitle(this.props.index, true)}
              />
            </div>
            <div className="col">
              <input
                className="form-control score"
                title={tex('Score de l\'association')}
                type="number"
                value={this.props.pair.solution.score}
              />
            </div>
            <div className="col">
              <textarea
                className="form-control"
                value={this.props.pair.right.data}
                onChange={() => {}}
                title={this.makeDataFieldTitle(this.props.index, false)}
              />
            </div>
          </div>
          { this.state.showFeedback &&
            <div className="feedback-container">
              <textarea className="form-control" value={this.props.pair.solution.feedback}></textarea>
            </div>
          }
        </div>
        <div className="right-controls">
          <a role="button" title={t('delete')} className="fa fa-trash-o"></a>
          <a role="button" title={tex('feedback')} onClick={() => this.setState({showFeedback : !this.state.showFeedback})} className="fa fa-comment-o"></a>
        </div>
      </div>
    )
  }
}

PairItem.propTypes = {
  pair: T.object.isRequired,
  index: T.number.isRequired
}

class Pair extends Component{
  constructor(props){
    super(props)
    this.state = {
      items: this.getItems()
    }
  }

  getItems(){
    let pairs = []
    let odds = []
    for(const item of this.props.left){
      // not in solutions
      const solution = this.props.solutions.find(el => el.leftId === item.id)
      if(undefined === solution){
        const odd = {
          id: item.id,
          type: item.type,
          data: item.data
        }
        odds.push(odd)
      } else {
        // find right item -> can not be undefined !!! ?
        const right = this.props.right.find(el => el.id === solution.rightId)
        const pair = {
          right: right,
          left: item,
          solution: solution
        }
        pairs.push(pair)
      }
    }

    return {
      pairs: pairs,
      odds: odds
    }
  }

  render() {
    return(
      <div className="pair-question-container">
        <div className="form-group">
          <label htmlFor="set-penalty">{tex('Pénalité')}</label>
          <input
            id="penalty"
            value={this.props.penalty}
            title={tex('score')}
            type="number"
            className="form-control member-score"
          />
        </div>
        <div className="checkbox">
          <label>
            <input
              type="checkbox"
              checked={this.props.random}
            />
             {tex('Ordre des items aléatoire.')}
          </label>
        </div>
        <hr/>
        <div className="pair-question-items-container">
          {this.state.items.pairs.map((pair, index) =>
            <div key={index}>
              <PairItem index={index} pair={pair} />
            </div>
          )}
          <div className="row">
            <div className="col-xs-12 text-center">
              <button className="btn btn-default">
                <i className="fa fa-plus"></i>&nbsp; Ajouter une paire
              </button>
            </div>
          </div>
        </div>
        <hr/>
        <div className="pair-question-odds-container">
          <div className="odd-item-panel">
            <div className="title-container">
              <label>Intrus</label>
            </div>
            <div className="odd-items">
              {this.state.items.odds.map((odd, index) =>
              <OddItem key={index} index={index} odd={odd} />
              )}
            </div>
            <hr/>
            <div className="row margin-top-m">
              <div className="col-xs-12 text-center">
                <button className="btn btn-default">
                  <i className="fa fa-plus"></i>&nbsp; Ajouter un intru
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}


Pair.propTypes = {
  random: React.PropTypes.bool.isRequired,
  penalty: React.PropTypes.number.isRequired,
  left: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
  right: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
  solutions: React.PropTypes.arrayOf(React.PropTypes.object).isRequired
}

export {Pair}
