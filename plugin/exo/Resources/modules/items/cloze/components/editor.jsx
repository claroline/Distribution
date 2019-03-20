import React, {Component} from 'react'
import {PropTypes as T} from 'prop-types'
import get from 'lodash/get'
import cloneDeep from 'lodash/cloneDeep'

import {makeId} from '#/main/core/scaffolding/id'
import {keywords as keywordsUtils} from '#/plugin/exo/utils/keywords'
import {utils} from '#/plugin/exo/items/cloze/utils/utils'
import {trans, tex} from '#/main/app/intl/translation'
import {Textarea} from '#/main/core/layout/form/components/field/textarea'
import {FormGroup} from '#/main/app/content/form/components/group'
import {ClozeItem as ClozeItemTypes} from '#/plugin/exo/items/grid/prop-types'
import {KeywordsPopover} from '#/plugin/exo/items/components/keywords.jsx'
import {FormData} from '#/main/app/content/form/containers/data'

const HolePopover = props => {
  // Let's calculate the popover position
  // It will be positioned just under the edit button
  const btnElement = document.querySelector(`.cloze-hole[data-hole-id="${props.hole.id}"] .edit-hole-btn`)

  let left = btnElement.offsetLeft
  let top  = btnElement.offsetTop

  left += btnElement.offsetWidth / 2 // center popover and edit btn
  top  += btnElement.offsetHeight // position popover below edit btn

  left -= 180 // half size of the popover
  top  += 25 // take into account the form group label

  return (
    <KeywordsPopover
      id={props.hole.id}
      positionLeft={left}
      positionTop={top}
      title={tex('cloze_edit_hole')}
      keywords={props.solution.answers}
      _multiple={props.hole._multiple}
      _errors={get(props, '_errors')}
      validating={props.validating}
      showCaseSensitive={true}
      showScore={true}
      close={props.close}
      remove={props.remove}
      onChange={props.onChange}
      addKeyword={props.addKeyword}
      removeKeyword={props.removeKeyword}
      updateKeyword={props.updateKeyword}
    >
      <FormGroup
        id={`item-${props.hole.id}-size`}
        label={tex('size')}
        warnOnly={!props.validating}
        error={get(props, '_errors.size')}
      >
        <input
          id={`item-${props.hole.id}-size`}
          type="number"
          min="0"
          value={props.hole.size}
          className="form-control"
          onChange={e => props.onChange('size', parseInt(e.target.value))}
        />
      </FormGroup>
    </KeywordsPopover>
  )
}

HolePopover.propTypes = {
  hole: T.shape({
    id: T.string.isRequired,
    _multiple: T.bool.isRequired,
    size: T.number
  }).isRequired,
  solution: T.shape({
    answers: T.array.isRequired
  }).isRequired,
  validating: T.bool.isRequired,
  _errors: T.object,
  close: T.func.isRequired,
  remove:T.func.isRequired,
  onChange: T.func.isRequired, // update hole properties
  addKeyword: T.func.isRequired,
  removeKeyword: T.func.isRequired,
  updateKeyword: T.func.isRequired
}

export class ClozeEditor extends Component {
  constructor(props) {
    super(props)
    this.selection = null
    this.word = null
    this.fnTextUpdate = () => {}
    this.state = { allowCloze: true }
    this.changeEditorMode = this.changeEditorMode.bind(this)
  }

  onSelect(word, cb) {
    this.word = word
    this.fnTextUpdate = cb
  }

  onHoleClick(el, item) {
    if (el.classList.contains('edit-hole-btn') || el.classList.contains('edit-hole-btn-icon')) {
      const newItem = cloneDeep(item)
      const hole = getHoleFromId(newItem, el.dataset.holeId)
      hole._multiple = !!hole.choices
      newItem._popover = true
      newItem._holeId = action.holeId

      
    } else if (el.classList.contains('delete-hole-btn') || el.classList.contains('delete-hole-btn-icon')) {
      this.props.onChange(actions.removeHole(el.dataset.holeId))
    }
  }

  changeEditorMode(editorState) {
    this.setState({ allowCloze: editorState.minimal})
  }

  addHole(item) {
    const newItem = cloneDeep(item)

    const hole = {
      id: makeId(),
      feedback: '',
      size: 10,
      _score: 0,
      _multiple: false,
      placeholder: ''
    }

    const keyword = keywordsUtils.createNew()
    keyword.text = this.word
    keyword._deletable = false

    const solution = {
      holeId: hole.id,
      answers: [keyword]
    }

    newItem.holes.push(hole)
    newItem.solutions.push(solution)
    newItem._popover = true
    newItem._holeId = hole.id
    newItem._text = this.fnTextUpdate(utils.makeTinyHtml(hole, solution))
    newItem.text = utils.getTextWithPlacerHoldersFromHtml(newItem._text)

    this.props.update('holes', newItem.holes)
    this.props.update('solutions', newItem.solutions)
    this.props.update('_popover', newItem._popover)
    this.props.update('_holeId', newItem._holeId)
    this.props.update('_text', newItem._text)
    this.props.update('text', newItem.text)
  }

  render() {
    return (<FormData
      className="cloze-editor"
      embedded={true}
      name={this.props.formName}
      dataPart={this.props.path}
      sections={[
        {
          title: trans('general'),
          primary: true,
          fields: [
            {
              label: trans('grid_score_mode_label', {}, 'quiz'),
              name: 'score.type',
              render: (item, errors) => {
                return (<fieldset className="cloze-editor">
                  <FormGroup
                    id="cloze-text"
                    className="cloze-text"
                    label={trans('text')}
                    warnOnly={!this.props.validating}
                    error={get(item, '_errors.text')}
                  >
                    <Textarea
                      id="cloze-text"
                      value={item._text}
                      onChange={(value) => {
                        //TODO: optimize this
                        item = Object.assign({}, item, {
                          text: utils.getTextWithPlacerHoldersFromHtml(value),
                          _text: value
                        })

                        const holesToRemove = []
                        // we need to check if every hole is mapped to a placeholder
                        // if there is not placeholder, then remove the hole
                        item.holes.forEach(hole => {
                          if (item.text.indexOf(`[[${hole.id}]]`) < 0) {
                            holesToRemove.push(hole.id)
                          }
                        })

                        if (holesToRemove) {
                          const holes = cloneDeep(item.holes)
                          const solutions = cloneDeep(item.solutions)
                          holesToRemove.forEach(toRemove => {
                            holes.splice(holes.findIndex(hole => hole.id === toRemove), 1)
                            solutions.splice(solutions.findIndex(solution => solution.holeId === toRemove), 1)
                          })
                          item = Object.assign({}, item, {holes, solutions})
                        }

                        this.props.update('text', item.text)
                        this.props.update('_text', item._text)
                        this.props.update('holes', item.holes)
                        this.props.update('solutions', item.solutions)
                      }}
                      onSelect={this.onSelect.bind(this)}
                      onClick={this.onHoleClick.bind(this)}
                      onChangeMode={this.changeEditorMode}
                    />
                  </FormGroup>

                  <button
                    type="button"
                    className="btn btn-block btn-default"
                    disabled={!this.state.allowCloze}
                    onClick={() => this.addHole(item)}
                  >
                    <span className="fa fa-fw fa-plus" />
                    {tex('create_cloze')}
                  </button>

                  {(this.props.item._popover && this.props.item._holeId) &&
                    <HolePopover
                      hole={this.props.item.holes.find(hole => hole.id === this.props.item._holeId)}
                      solution={this.props.item.solutions.find(solution => solution.holeId === this.props.item._holeId)}
                      close={() => this.props.onChange(
                        actions.closePopover()
                      )}
                      remove={() => this.props.onChange(
                        actions.removeHole(this.props.item._holeId)
                      )}
                      onChange={(property, value) => this.props.onChange(
                        actions.updateHole(this.props.item._holeId, property, value)
                      )}
                      addKeyword={() => this.props.onChange(
                        actions.addAnswer(this.props.item._holeId)
                      )}
                      removeKeyword={(keywordId) => this.props.onChange(
                        actions.removeAnswer(this.props.item._holeId, keywordId)
                      )}
                      updateKeyword={(keywordId, property, newValue) => this.props.onChange(
                        actions.updateAnswer(this.props.item._holeId, keywordId, property, newValue)
                      )}
                      validating={this.props.validating}
                      _errors={get(this.props.item, '_errors.'+this.props.item._holeId)}
                    />
                  }
                </fieldset>
                )}
            }]
        }
      ]}
    />
    )}
}

ClozeEditor.propTypes = {
  item: T.shape({
    id: T.string.isRequired,
    text: T.string.isRequired,
    _text: T.string.isRequired,
    _errors: T.object,
    _popover: T.bool,
    _holeId: T.string,
    holes: T.arrayOf(T.shape({
      id: T.string.isRequired
    })).isRequired,
    solutions: T.arrayOf(T.shape({
      holeId: T.string.isRequired
    })).isRequired
  }),
  onChange: T.func.isRequired,
  validating: T.bool.isRequired
}
