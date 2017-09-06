import React, {Component} from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'
import cloneDeep from 'lodash/cloneDeep'

import {t} from '#/main/core/translation'
import {actions} from './../actions.js'

const ItemTagsList = props => {
  return (
    <div className="item-tags-list">
      {props.tags.map((tag, index) =>
        <ItemTag key={index} tag={tag} removeTag={props.removeTag}/>
      )}
    </div>
  )
}

ItemTagsList.propTypes = {
  tags: T.arrayOf(T.string),
  removeTag: T.func.isRequired
}

const ItemTag = props => {
  return (
    <div className="item-tag label label-default">
      <span className="tag-title">
        {props.tag}
      </span>
      <span
        className="tag-remove-btn fa fa-fw fa-times pointer-hand"
        onClick={() => props.removeTag(props.tag)}
      >
      </span>
    </div>
  )
}

ItemTag.propTypes = {
  tag: T.string.isRequired,
  removeTag: T.func.isRequired
}

class TagsEditor extends Component {
  constructor(props) {
    super(props)
    this.state = {
      currentTag: ''
    }
  }

  updateCurrentTag(value) {
    this.setState({
      currentTag: value
    })
  }

  addCurrentTag() {
    const trimmedTag = this.state.currentTag.trim()

    if (!this.isTagPresent(trimmedTag)) {
      const tags = cloneDeep(this.props.item.tags)
      tags.push(trimmedTag)
      this.props.updateItemTags(this.props.item.id, tags)
    }
    this.updateCurrentTag('')
  }

  removeTag(tag) {
    const tags = cloneDeep(this.props.item.tags)
    const index = tags.findIndex(t => t === tag)

    if (index >= 0) {
      tags.splice(index, 1)
      this.props.updateItemTags(this.props.item.id, tags)
    }
  }

  isTagPresent(tag) {
    return this.props.item.tags.find(t => tag.toUpperCase() === t.trim().toUpperCase())
  }

  render() {
    return (
      <div className="tags-editor">
        <ItemTagsList
          tags={this.props.item.tags}
          removeTag={tag => this.removeTag(tag)}
        />
        <div className="input-group">
          <input
            className="form-control"
            type="text"
            value={this.state.currentTag}
            onChange={e => this.updateCurrentTag(e.target.value)}
          />
          <span className="input-group-btn">
            <button
              className="btn btn-default"
              disabled={!this.state.currentTag.trim()}
              onClick={() => this.addCurrentTag()}
            >
              {t('add')}
            </button>
          </span>
        </div>
      </div>
    )
  }
}

TagsEditor.propTypes = {
  item: T.shape({
    id: T.string.isRequired,
    tags: T.arrayOf(T.string)
  }).isRequired,
  updateItemTags: T.func.isRequired
}

function mapStateToProps() {
  return {}
}

export default connect(mapStateToProps, actions)(TagsEditor)
