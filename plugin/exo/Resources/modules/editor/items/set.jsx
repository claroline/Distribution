import React, {Component} from 'react'
import {tex, t} from './../lib/translate'
import {connect} from 'react-redux'
import {change} from 'redux-form'
import classes from 'classnames'
import {ITEM_FORM} from './../components/item-form.jsx'


import {
  setDeletablesSelector,
  memberDeletablesSelector,
  getMemberData
} from './set'

const T = React.PropTypes

class MemberItem extends Component {
  constructor(props) {
    super(props)
    this.state = {showFeedback: false}
  }

  render() {
    return (
      <div className="member-container">
        <div className="text-fields">
          <textarea
            className="form-control claroline-tiny-mce hide"
            value={getMemberData(this.props.solution.memberId, this.props.members)}
            onChange=""
          />
        {this.state.showFeedback &&
          <div className="feedback-container">
            <textarea
              className="form-control claroline-tiny-mce hide"
              value={this.props.solution.feedback}
              onChange=""
            />
          </div>
        }
        </div>

        <div className="right-controls">
            <input
              value={this.props.solution.score}
              title={tex('score')}
              type="number"
              className="form-control member-score"
              onChange=""
            />
            <span
              role="button"
              aria-disabled={!this.props.deletable}
              title={t('delete')}
              className={classes('fa', 'fa-trash-o', {disabled: !this.props.deletable})}
              onClick={() => this.props.deletable && this.props.onRemove()}
            />
            <span
              role="button"
              title={tex('set_member_feedback_info')}
              className="fa fa-comments-o"
              onClick={() => this.setState({showFeedback: !this.state.showFeedback})}
            />
        </div>
      </div>
    )
  }
}

MemberItem.propTypes = {
  solution: T.object.isRequired,
  members: T.arrayOf(T.object).isRequired,
  deletable: T.bool.isRequired,
  onRemove: T.func.isRequired,
  changeFieldValue: T.func.isRequired
}

class SetPanel extends Component {
  constructor(props) {
    super(props)
    this.state = {toggled: false}
  }

  render() {
    return (
      <div className="panel panel-default">
        <div className="panel-heading">
          <span className="btn-group pull-right">
            <span role="button" title={t('delete')} className="fa fa-trash-o"></span>
            &nbsp;
            <span
              role="button"
              title={tex('show_hide_panel_content')}
              className={
                classes(
                  'btn-relative',
                  'fa',
                  this.state.toggled ? 'fa-caret-down' : 'fa-caret-up'
                )
              }
              onClick={() => this.setState({toggled: !this.state.toggled})}></span>
          </span>
          <input
            className="form-control input-control-sm"
            value={this.props.set.name}
            type="text"
            onChange="" />
        </div>
        {!this.state.toggled &&
          <div className="panel-body">
            {this.props.solutions.map((solution, index) =>
              solution.setId === this.props.set.id &&
              <MemberItem
                members={this.props.members}
                solution={solution}
                key={solution.setId + '-' + solution.memberId}
                deletable={true}
                onRemove={() => {this.props.solutions.remove(index)}}
                changeFieldValue={this.props.changeFieldValue}
              />
            )}
            <div className="text-center">
              <button type="button" className="btn btn-default">
                <span className="fa fa-plus"/>
                &nbsp;{tex('set_question_add_member')}
              </button>
            </div>
          </div>
        }
      </div>
    )
  }
}

SetPanel.propTypes = {
  solutions: T.arrayOf(T.object).isRequired,
  members:  T.arrayOf(T.object).isRequired,
  set: T.object.isRequired,
  setDeletables: T.arrayOf(T.bool).isRequired,
  memberDeletables: T.arrayOf(T.bool).isRequired,
  changeFieldValue: T.func.isRequired
}

const SetItems = props =>
  <div className="set-question-container">
  {props.sets.map((set) =>
    <SetPanel
      key={set.id}
      setDeletables={props.setDeletables}
      memberDeletables={props.memberDeletables}
      changeFieldValue={props.changeFieldValue}
      solutions={props.solutions}
      members={props.members}
      set={set}
    />
  )}
    <div className="add-set-footer">
      <button type="button" className="btn btn-default">
        <span className="fa fa-plus"/>
        &nbsp;{tex('set_question_add_set')}
      </button>
    </div>
  </div>


SetItems.propTypes = {
  solutions: T.arrayOf(T.object).isRequired,
  members:  T.arrayOf(T.object).isRequired,
  sets: T.arrayOf(T.object).isRequired,
  setDeletables: T.arrayOf(T.bool).isRequired,
  memberDeletables: T.arrayOf(T.bool).isRequired,
  changeFieldValue: T.func.isRequired
}

class OddsPanel extends Component {
  constructor(props) {
    super(props)
    this.state = {toggled: false}
  }

  render() {
    return (
      <div className="panel panel-default">
        <div className="panel-heading">
          <span className="btn-group pull-right">
            <span
              role="button"
              title={tex('show_hide_panel_content')}
              className={
                classes(
                  'btn-relative',
                  'fa',
                  this.state.toggled ? 'fa-caret-down' : 'fa-caret-up'
                )
              }
              onClick={() => this.setState({toggled: !this.state.toggled})}></span>
          </span>
          <h5>{tex('set_question_add_odds')}</h5>
        </div>
        {!this.state.toggled &&
          <div className="panel-body">
            <div className="set-question-container">
              <div className="member-container">
                <div className="text-fields">
                  <textarea
                    className="form-control claroline-tiny-mce hide"
                    value={'I am an ODD'}
                    onChange=""
                  />
                </div>
                <div className="right-controls">
                  <span
                    role="button"
                    title={t('delete')}
                    className="fa fa-trash-o"
                  />
                  <span
                    role="button"
                    title={tex('set_member_feedback_info')}
                    className="fa fa-comments-o"
                  />
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-12 center-text">
                <button className="btn btn-default">
                  <i className="fa fa-plus"></i>&nbsp;{tex('set_question_add_odd')}
                </button>
              </div>
            </div>
          </div>
        }
      </div>
    )
  }
}

OddsPanel.propTypes = {
  odds: T.arrayOf(T.object).isRequired
}

const SetForm = props =>
  <fieldset>
    <div className="form-group">
      <label htmlFor="set-penalty">{tex('set_question_penalty_label')}</label>
      <input
        id="set-penalty"
        step="1"
        min="0"
        value={props.penalty}
        title={tex('score')}
        type="number"
        className="form-control member-score"
        onChange=""
      />
    </div>
    <div className="checkbox">
      <label>
        <input
          type="checkbox"
          onChange=""
          value={props.shuffle} /> 
        {tex('set_question_shuffle_label')}
      </label>
    </div>
    <hr/>
    <SetItems
      setDeletables={props.setDeletables}
      memberDeletables={props.memberDeletables}
      changeFieldValue={props.changeFieldValue}
      solutions={props.solutions}
      members={props.members}
      sets={props.sets}
    />
    <hr/>
    <OddsPanel odds={[]}></OddsPanel>
  </fieldset>

SetForm.propTypes = {
  setDeletables: T.arrayOf(T.bool).isRequired,
  memberDeletables: T.arrayOf(T.bool).isRequired,
  changeFieldValue: T.func.isRequired,
  solutions: T.arrayOf(T.object).isRequired,
  members:  T.arrayOf(T.object).isRequired,
  sets: T.arrayOf(T.object).isRequired,
  penalty: T.number.isRequired,
  shuffle: T.bool.isRequired
}

let Set = props =>
  <SetForm
    setDeletables={props.setDeletables}
    memberDeletables={props.memberDeletables}
    changeFieldValue={props.changeFieldValue}
    solutions={props.solutions}
    members={props.members}
    sets={props.sets}
    penalty={props.penalty}
    shuffle={props.shuffle}
  />

Set.propTypes = {
  setDeletables: T.arrayOf(T.bool).isRequired,
  memberDeletables: T.arrayOf(T.bool).isRequired,
  changeFieldValue: T.func.isRequired,
  solutions: T.arrayOf(T.object).isRequired,
  members:  T.arrayOf(T.object).isRequired,
  sets: T.arrayOf(T.object).isRequired,
  penalty: T.number.isRequired,
  shuffle: T.bool.isRequired
}

Set = connect(
  state => ({
    setDeletables: setDeletablesSelector(state),
    memberDeletables: memberDeletablesSelector(state)
  }),
  dispatch => ({
    changeFieldValue: (field, value) =>
      dispatch(change(ITEM_FORM, field, value))
  })
)(Set)

export {Set}
