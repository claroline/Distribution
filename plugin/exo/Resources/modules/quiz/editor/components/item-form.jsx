import React, {Component} from 'react'
import {PropTypes as T} from 'prop-types'
import get from 'lodash/get'

import {t, tex} from '#/main/core/translation'
import {HINT_ADD, HINT_ADD_PHOTO, HINT_CHANGE, HINT_REMOVE} from './../actions'
import {FormGroup} from '#/main/core/layout/form/components/form-group.jsx'
import {Textarea} from '#/main/core/layout/form/components/textarea.jsx'
import {SubSection} from './../../../components/form/sub-section.jsx'
import {TooltipButton} from './../../../components/form/tooltip-button.jsx'
import ObjectsEditor from './item-objects-editor.jsx'

//import {ImageInput} from './../../../items/graphic/components/image-input.jsx'

// TODO: add categories, objects, resources, define-as-model

{/*Tabs START*/}

const tabsLi = {
  display: 'inline-block',
  marginRight: 10,
}

const tabsBox = {
  margin: '20px auto 20px',
}

/*const uploadPicBox = {
  height: 60,
  width: 60,
  background: 'url(https://cdn4.iconfinder.com/data/icons/pictype-free-vector-icons/16/add-64.png)',
  backgroundRepeat: 'no-repeat',
  backgroundSize: 'contain',
  overflow: 'hidden',
}

const uploadPicInput = {
  height: 60,
  width: 60,
  opacity: 0,
  cursor: 'pointer',
}*/

const picsBox = {
  height: 70,
}

/*onSelectImage(file) {
  if (file.type.indexOf('image') !== 0) {
    return this.props.onChange(actions.selectImage({_type: file.type}))
  }

  if (file.size > MAX_IMG_SIZE) {
    return this.props.onChange(actions.selectImage({_size: file.size}))
  }

  const reader = new window.FileReader()
  reader.onload = e => {
    const img = this.createImage(e.target.result)
    img.onload = () => {
      this.props.onChange(actions.selectImage({
        type: file.type,
        data: e.target.result,
        width: img.naturalWidth,
        height: img.naturalHeight,
        _clientWidth: img.width,
        _clientHeight: img.height,
        _size: file.size
      }))
    }
  }
  reader.readAsDataURL(file)
}*/

var Tabs = React.createClass({
  displayName: 'Tabs',
  propTypes: {
    selected: React.PropTypes.number,
    children: React.PropTypes.oneOfType([
      React.PropTypes.array,
      React.PropTypes.element
    ]).isRequired
  },
  getDefaultProps: function () {
    return {
      selected: 0
    };
  },
  getInitialState: function () {
    return {
      selected: this.props.selected
    };
  },
  shouldComponentUpdate(nextProps, nextState) {
    return this.props !== nextProps || this.state !== nextState;
  },
  handleClick: function (index, event) {
    event.preventDefault();
    this.setState({
      selected: index
    });
  },
  _renderTitles: function () {
    function labels(child, index) {
      var activeClass = (this.state.selected === index ? 'active' : '');
      return (
        <li key={index} style={tabsLi}>
          <a href="#"
            className={activeClass}
            onClick={this.handleClick.bind(this, index)}>
            {child.props.label}
          </a>
        </li>
      );
    }
    return (
      <ul className="tabs__labels">
        {this.props.children.map(labels.bind(this))}
      </ul>
    );
  },
  _renderContent: function () {
    return (
      <div className="tabs__content">
        {this.props.children[this.state.selected]}
      </div>
    );
  },
  render: function () {
    return (
      <div className="tabs" style={tabsBox}>
        {this._renderTitles()}
        {this._renderContent()}
      </div>
    );
  }
});

var Pane = React.createClass({
  displayName: 'Pane',
  propTypes: {
    label: React.PropTypes.string.isRequired,
    children: React.PropTypes.element.isRequired
  },
  render: function () {
    return (
      <div>
        {this.props.children}
      </div>
    );
  }
});

{/* Tabs END */}

const Metadata = props =>
  <fieldset>
    <FormGroup
      controlId={`item-${props.item.id}-title`}
      label={t('title')}
    >
      <input
        id={`item-${props.item.id}-title`}
        type="text"
        value={props.item.title || ''}
        className="form-control"
        onChange={e => props.onChange('title', e.target.value)}
      />
    </FormGroup>
    <FormGroup
      controlId={`item-${props.item.id}-description`}
      label={t('description')}
    >
      <Textarea
        id={`item-${props.item.id}-description`}
        content={props.item.description || ''}
        onChange={text => props.onChange('description', text)}
      />
    </FormGroup>
    <FormGroup
      controlId={`item-${props.item.id}-objects`}
      label={tex('question_objects')}
    >
      <ObjectsEditor
        showModal={props.showModal}
        closeModal={props.closeModal}
        validating={props.validating}
        item={props.item}
      />
    </FormGroup>
  </fieldset>

Metadata.propTypes = {
  item: T.shape({
    id: T.string.isRequired,
    title: T.string.isRequired,
    description: T.string.isRequired
  }).isRequired,
  showModal: T.func.isRequired,
  closeModal: T.func.isRequired,
  onChange: T.func.isRequired,
  validating: T.bool.isRequired
}

const Hint = props =>
  <div className="hint-item">
    <div className="hint-value">
      <Textarea
        id={`hint-${props.id}`}
        title={tex('hint')}
        content={props.value}
        onChange={value => props.onChange(HINT_CHANGE, {id: props.id, value})}
      />
    </div>
    <input
      id={`hint-${props.id}-penalty`}
      title={tex('penalty')}
      type="number"
      min="0"
      value={props.penalty}
      className="form-control hint-penalty"
      aria-label={tex('penalty')}
      onChange={e => props.onChange(
        HINT_CHANGE,
        {id: props.id, penalty: e.target.value}
      )}
    />
    <TooltipButton
      id={`hint-${props.id}-delete`}
      title={t('delete')}
      label={<span className="fa fa-fw fa-trash-o"/>}
      className="btn-link-default"
      onClick={props.onRemove}
    />
  </div>

Hint.propTypes = {
  id: T.string.isRequired,
  value: T.string.isRequired,
  penalty: T.number.isRequired,
  onChange: T.func.isRequired,
  onRemove: T.func.isRequired
}

const HintPhoto = props =>
  <div className="hint-item">
    <div className="hint-value">
      Drag and drop
    </div>
    <input
      id={`hint-${props.id}-penalty`}
      title={tex('penalty')}
      type="number"
      min="0"
      value={props.penalty}
      className="form-control hint-penalty"
      aria-label={tex('penalty')}
      onChange={e => props.onChange(
        HINT_CHANGE,
        {id: props.id, penalty: e.target.value}
      )}
    />
    <TooltipButton
      id={`hint-${props.id}-delete`}
      title={t('delete')}
      label={<span className="fa fa-fw fa-trash-o"/>}
      className="btn-link-default"
      onClick={props.onRemove}
    />
  </div>

HintPhoto.propTypes = {
  id: T.string.isRequired,
  value: T.string.isRequired,
  penalty: T.number.isRequired,
  onChange: T.func.isRequired,
  onRemove: T.func.isRequired
}

const Hints = props =>
  <div className="hint-items">
    <label className="control-label" htmlFor="hint-list">
      {tex('hints')}
    </label>
    {props.hints.length === 0 &&
      <div className="no-hint-info">{tex('no_hint_info')}</div>
    }

    {props.hints.length !== 0 &&
      <ul id="hint-list">
        {props.hints.map(hint =>
          <li key={hint.id}>
            HINT ! {hint.id}
            <Hint
              {...hint}
              onChange={props.onChange}
              onRemove={() => props.onChange(HINT_REMOVE, {id: hint.id})}
            />
          </li>
        )}


        {props.hints.map(hintPhoto =>
          <li key={hintPhoto.id + "123"}>
          HINT_PHOTO ! {hintPhoto.id}
            <HintPhoto
              {...hintPhoto}
              onChange={props.onChange}
              onRemove={() => props.onChange(HINT_REMOVE, {id: hintPhoto.id})}
            />
          </li>
        )}
      </ul>
    }

    <div className="footer">
      <button
        type="button"
        className="btn btn-default"
        onClick={() => props.onChange(HINT_ADD, {})}
      >
        <span className="fa fa-fw fa-plus"/>
        {tex('add_hint')}
      </button>

      <button
        type="button"
        className="btn btn-default"
        onClick={() => props.onChange(HINT_ADD_PHOTO, {})}
      >
        <span className="fa fa-fw fa-plus"/>
        {tex('add_hint_photo')}
      </button>
    </div>
  </div>

Hints.propTypes = {
  hints: T.arrayOf(T.shape({
    id: T.string.isRequired
  })).isRequired,
  onChange: T.func.isRequired
}

export class ItemForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      metaHidden: true,
      feedbackHidden: true
    }
  }

  render() {
    return (
      <form>
        <FormGroup
          controlId={`item-${this.props.item.id}-content`}
          label={tex('question')}
          warnOnly={!this.props.validating}
          error={get(this.props.item, '_errors.content')}
        >
          <Textarea
            id={`item-${this.props.item.id}-content`}
            content={this.props.item.content}
            onChange={content => this.props.onChange('content', content)}
          />
        </FormGroup>
        <SubSection
          hidden={this.state.metaHidden}
          showText={tex('show_metadata_fields')}
          hideText={tex('hide_metadata_fields')}
          toggle={() => this.setState({metaHidden: !this.state.metaHidden})}
        >
          <Metadata
            item={this.props.item}
            showModal={this.props.showModal}
            closeModal={this.props.closeModal}
            onChange={this.props.onChange}
            validating={this.props.validating}
          />
        </SubSection>
        <hr className="item-content-separator" />
        {this.props.children}
        <hr className="item-content-separator" />
        <SubSection
          hidden={this.state.feedbackHidden}
          showText={tex('show_interact_fields')}
          hideText={tex('hide_interact_fields')}
          toggle={() => this.setState({feedbackHidden: !this.state.feedbackHidden})}
        >


        <div>
          <Tabs selected={null}>
            <Pane label="Ajouter un indice">
              <div>
                <fieldset>
                  <Hints
                    hints={this.props.item.hints}
                    onChange={this.props.onHintsChange}
                  />
                  <hr className="item-content-separator" />
                  <FormGroup
                    controlId={`item-${this.props.item.id}-feedback`}
                    label={tex('feedback')}
                  >
                    <Textarea
                      id={`item-${this.props.item.id}-feedback`}
                      content={this.props.item.feedback}
                      onChange={text => this.props.onChange('feedback', text)}
                    />
                  </FormGroup>
                </fieldset>
              </div>
            </Pane>
            <Pane label="Ajouter un indice photo">
              <div>
                <div>
                  <form enctype="multipart/form-data" onChange={this.handleSubmit}>
                    <hr/>
                    <h3>Ajouter des logos (choix multiples)</h3>

                    <div style={picsBox}>
                      <form>
                        <input type="file" />
                        <button type="submit">Envoyer</button>
                      </form>
                    </div>
                  </form>

                </div>
                <hr/>
              </div>
            </Pane>
          </Tabs>
        </div>



        </SubSection>
      </form>
    )
  }
}

ItemForm.propTypes = {
  item: T.shape({
    id: T.string.isRequired,
    content: T.string.isRequired,
    hints: T.arrayOf(T.object).isRequired,
    feedback: T.string.isRequired,
    _errors: T.object
  }).isRequired,
  children: T.element.isRequired,
  validating: T.bool.isRequired,
  showModal: T.func.isRequired,
  closeModal: T.func.isRequired,
  onChange: T.func.isRequired,
  onHintsChange: T.func.isRequired
}
