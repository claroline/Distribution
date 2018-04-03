import React, {Component} from 'react'
import {connect} from 'react-redux'
import {PropTypes as T} from 'prop-types'
import classes from 'classnames'
import Panel from 'react-bootstrap/lib/Panel'
import PanelGroup from 'react-bootstrap/lib/PanelGroup'

import {trans, t} from '#/main/core/translation'
import {select as formSelect} from '#/main/core/data/form/selectors'
import {actions as formActions} from '#/main/core/data/form/actions'
import {select as resourceSelect} from '#/main/core/resource/selectors'
import {actions as modalActions} from '#/main/core/layout/modal/actions'
import {constants as listConstants} from '#/main/core/data/list/constants'

import {FormContainer} from '#/main/core/data/form/containers/form.jsx'
import {FormGroup} from '#/main/core/layout/form/components/group/form-group.jsx'
import {CheckGroup} from '#/main/core/layout/form/components/group/check-group.jsx'
import {SelectGroup} from '#/main/core/layout/form/components/group/select-group.jsx'
import {RadiosGroup} from '#/main/core/layout/form/components/group/radios-group.jsx'
import {Date} from '#/main/core/layout/form/components/field/date.jsx'

import {ClacoForm as ClacoFormType} from '#/plugin/claco-form/resources/claco-form/prop-types'
import {constants} from '#/plugin/claco-form/resources/claco-form/constants'
import {actions} from '#/plugin/claco-form/resources/claco-form/editor/actions'

const getMultipleSelectValues = (e) => {
  const values = []

  for (let i = 0; i < e.target.options.length; i++) {
    if (e.target.options[i].selected) {
      values.push(e.target.options[i].value)
    }
  }

  return values
}

const Random = props =>
  <fieldset>
    <CheckGroup
      id="params-random-enabled"
      value={props.params.random_enabled}
      label={trans('label_random_enabled', {}, 'clacoform')}
      onChange={checked => props.updateParameters('random_enabled', checked)}
    />
    <div className="form-group row">
      <span className="control-label col-md-4">
        {trans('label_random_categories', {}, 'clacoform')}
      </span>
      <div className="col-md-5">
        <select
          className="form-control"
          name="params-random-categories[]"
          defaultValue={props.params.random_categories}
          onChange={e => props.updateParameters('random_categories', getMultipleSelectValues(e))}
          multiple
        >
          {props.categories.map(category =>
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          )}
        </select>
      </div>
    </div>
    <div className="form-group form-group-align row">
      <span className="control-label col-md-4">
        {trans('label_random_date', {}, 'clacoform')}
      </span>
      <div className="col-md-2">
        <Date
          id="params-random-start-date"
          value={props.params.random_start_date}
          onChange={date => props.updateParameters('random_start_date', date)}
        />
      </div>
      <div className="col-md-1 text-center">
        <i className="fa fa-fw fa-long-arrow-right"></i>
      </div>
      <div className="col-md-2">
        <Date
          id="params-random-end-date"
          value={props.params.random_end_date}
          onChange={date => props.updateParameters('random_end_date', date)}
        />
      </div>
    </div>
  </fieldset>

Random.propTypes = {
  params: T.shape({
    random_enabled: T.boolean,
    random_categories: T.array,
    random_start_date: T.string,
    random_end_date: T.string
  }).isRequired,
  categories: T.arrayOf(T.shape({
    id: T.number.isRequired,
    name: T.string.isRequired
  })),
  updateParameters: T.func.isRequired
}

const List = props =>
  <fieldset>
    <CheckGroup
      id="params-search-enabled"
      value={props.params.search_enabled}
      label={trans('label_search_enabled', {}, 'clacoform')}
      onChange={checked => props.updateParameters('search_enabled', checked)}
    />
    <CheckGroup
      id="params-search-column-enabled"
      value={props.params.search_column_enabled}
      label={trans('label_search_column_enabled', {}, 'clacoform')}
      onChange={checked => props.updateParameters('search_column_enabled', checked)}
    />
    <div className="form-group row">
      <span className="control-label col-md-3">
        {trans('label_search_columns', {}, 'clacoform')}
      </span>
      <div className="col-md-5">
        <select
          className="form-control"
          name="params-search-colums[]"
          defaultValue={props.params.search_columns}
          onChange={e => props.updateParameters('search_columns', getMultipleSelectValues(e))}
          multiple
        >
          <option value="title">
            {t('title')}
          </option>
          <option value="creationDateString">
            {t('date')}
          </option>
          <option value="userString">
            {t('user')}
          </option>
          <option value="categoriesString">
            {t('categories')}
          </option>
          <option value="keywordsString">
            {trans('keywords', {}, 'clacoform')}
          </option>
          {props.fields.filter(f => !f.hidden).map(field =>
            <option key={field.id} value={field.id}>
              {field.name}
            </option>
          )}
        </select>
      </div>
    </div>
    <RadiosGroup
      id="params-default-display-mode"
      label={trans('default_display_mode', {}, 'clacoform')}
      options={
        Object.keys(listConstants.DISPLAY_MODES).map(key => {
          return {
            value: key,
            label: listConstants.DISPLAY_MODES[key].label
          }
        })
      }
      value={props.params.default_display_mode || listConstants.DISPLAY_TABLE}
      onChange={value => props.updateParameters('default_display_mode', value)}
    />
    <SelectGroup
      id="params-display-title"
      label={trans('field_for_title', {}, 'clacoform')}
      choices={generateDisplayList(props)}
      noEmpty={true}
      value={props.params.display_title || 'title'}
      onChange={value => props.updateParameters('display_title', value)}
    />
    <SelectGroup
      id="params-display-subtitle"
      label={trans('field_for_subtitle', {}, 'clacoform')}
      choices={generateDisplayList(props)}
      noEmpty={true}
      value={props.params.display_subtitle || 'title'}
      onChange={value => props.updateParameters('display_subtitle', value)}
    />
    <SelectGroup
      id="params-display-content"
      label={trans('field_for_content', {}, 'clacoform')}
      choices={generateDisplayList(props)}
      noEmpty={true}
      value={props.params.display_content || 'title'}
      onChange={value => props.updateParameters('display_content', value)}
    />
  </fieldset>

List.propTypes = {
  params: T.shape({
    search_enabled: T.boolean,
    search_column_enabled: T.boolean,
    search_columns: T.array,
    default_display_mode: T.string,
    display_title: T.string,
    display_subtitle: T.string,
    display_content: T.string
  }).isRequired,
  fields: T.arrayOf(T.shape({
    id: T.number.isRequired,
    name: T.string.isRequired
  })),
  updateParameters: T.func.isRequired
}

const Categories = props =>
  <fieldset>
    <CheckGroup
      id="params-display-categories"
      value={props.params.display_categories}
      label={trans('label_display_categories', {}, 'clacoform')}
      onChange={checked => props.updateParameters('display_categories', checked)}
    />
  </fieldset>

Categories.propTypes = {
  params: T.shape({
    display_categories: T.boolean
  }).isRequired,
  updateParameters: T.func.isRequired
}

const Comments = props =>
  <fieldset>
    <CheckGroup
      id="params-comments-enabled"
      value={props.params.comments_enabled}
      label={trans('label_comments_enabled', {}, 'clacoform')}
      onChange={checked => props.updateParameters('comments_enabled', checked)}
    />

    {props.params.comments_enabled &&
      <SelectGroup
        id="params-comments-roles"
        label={trans('enable_comments_for_roles', {}, 'clacoform')}
        choices={props.roles.reduce((acc, r) => {
          acc[r.name] = t(r.translationKey)

          return acc
        }, {})}
        multiple={true}
        value={props.params.comments_roles || []}
        onChange={value => props.updateParameters('comments_roles', value)}
      />
    }

    <RadiosGroup
      id="params-moderate-comments"
      label={trans('label_moderate_comments', {}, 'clacoform')}
      options={[
        {value: 'all', label: t('yes')},
        {value: 'none', label: t('no')},
        {value: 'anonymous', label: trans('choice_anonymous_comments_only', {}, 'clacoform')}
      ]}
      value={props.params.moderate_comments}
      onChange={value => props.updateParameters('moderate_comments', value)}
    />
    <CheckGroup
      id="params-display-comments"
      value={props.params.display_comments}
      label={trans('label_display_comments', {}, 'clacoform')}
      onChange={checked => props.updateParameters('display_comments', checked)}
    />
    {props.params.display_comments &&
      <SelectGroup
        id="params-comments-display-roles"
        label={trans('display_comments_for_roles', {}, 'clacoform')}
        choices={props.roles.reduce((acc, r) => {
          acc[r.name] = t(r.translationKey)

          return acc
        }, {})}
        multiple={true}
        value={props.params.comments_display_roles || []}
        onChange={value => props.updateParameters('comments_display_roles', value)}
      />
    }
    <CheckGroup
      id="params-open-comments"
      value={props.params.open_comments}
      label={trans('label_open_panel_by_default', {}, 'clacoform')}
      onChange={checked => props.updateParameters('open_comments', checked)}
    />
    <CheckGroup
      id="params-display-comment-author"
      value={props.params.display_comment_author}
      label={trans('label_display_comment_author', {}, 'clacoform')}
      onChange={checked => props.updateParameters('display_comment_author', checked)}
    />
    <CheckGroup
      id="params-display-comment-date"
      value={props.params.display_comment_date}
      label={trans('label_display_comment_date', {}, 'clacoform')}
      onChange={checked => props.updateParameters('display_comment_date', checked)}
    />
  </fieldset>

Comments.propTypes = {
  params: T.shape({
    comments_enabled: T.boolean,
    anonymous_comments_enabled: T.boolean,
    moderate_comments: T.string,
    display_comments: T.boolean,
    open_comments: T.boolean,
    display_comment_author: T.boolean,
    display_comment_date: T.boolean,
    comments_roles: T.array,
    comments_display_roles: T.array
  }).isRequired,
  roles: T.arrayOf(T.shape({
    name: T.string.isRequired,
    translationKey: T.string.isRequired
  })).isRequired,
  updateParameters: T.func.isRequired
}

const Keywords = props =>
  <fieldset>
    <CheckGroup
      id="params-keywords-enabled"
      value={props.params.keywords_enabled}
      label={trans('label_keywords_enabled', {}, 'clacoform')}
      onChange={checked => props.updateParameters('keywords_enabled', checked)}
    />
    <CheckGroup
      id="params-new-keywords-enabled"
      value={props.params.new_keywords_enabled}
      label={trans('label_new_keywords_enabled', {}, 'clacoform')}
      onChange={checked => props.updateParameters('new_keywords_enabled', checked)}
    />
    <CheckGroup
      id="params-display-keywords"
      value={props.params.display_keywords}
      label={trans('label_display_keywords', {}, 'clacoform')}
      onChange={checked => props.updateParameters('display_keywords', checked)}
    />
  </fieldset>

Keywords.propTypes = {
  params: T.shape({
    keywords_enabled: T.boolean,
    new_keywords_enabled: T.boolean,
    display_keywords: T.boolean
  }).isRequired,
  updateParameters: T.func.isRequired
}

const generateDisplayList = (props) => {
  const displayList = {
    title: t('title'),
    date: t('date'),
    user: t('user'),
    categories: t('categories'),
    keywords: trans('keywords', {}, 'clacoform')
  }

  props.fields.filter(f => !f.hidden).map(field => {
    displayList[field.id] = field.name
  })

  return displayList
}

generateDisplayList.propTypes = {
  fields: T.arrayOf(T.shape({
    id: T.number.isRequired,
    name: T.string.isRequired,
    hidden: T.bool
  }))
}

const EditorComponent = props =>
  <section className="resource-section">
    <h2>{trans('configuration', {}, 'platform')}</h2>
    <FormContainer
      level={3}
      name="clacoFormForm"
      sections={[
        {
          id: 'general',
          icon: 'fa fa-fw fa-cogs',
          title: trans('general'),
          fields: [
            {
              name: 'details.max_entries',
              type: 'number',
              label: trans('label_max_entries', {}, 'clacoform'),
              required: true,
              options: {
                min: 0
              }
            }, {
              name: 'details.creation_enabled',
              type: 'boolean',
              label: trans('label_creation_enabled', {}, 'clacoform'),
              required: true
            }, {
              name: 'details.edition_enabled',
              type: 'boolean',
              label: trans('label_edition_enabled', {}, 'clacoform'),
              required: true
            }, {
              name: 'details.moderated',
              type: 'boolean',
              label: trans('label_moderated', {}, 'clacoform'),
              required: true
            }
          ]
        }, {
          id: 'display',
          icon: 'fa fa-fw fa-desktop',
          title: trans('display_parameters'),
          fields: [
            {
              name: 'details.default_home',
              type: 'enum',
              label: trans('label_default_home', {}, 'clacoform'),
              required: true,
              options: {
                noEmpty: true,
                choices: constants.DEFAULT_HOME_CHOICES
              }
            }, {
              name: 'details.display_nb_entries',
              type: 'enum',
              label: trans('label_display_nb_entries', {}, 'clacoform'),
              required: true,
              options: {
                noEmpty: true,
                choices: constants.DISPLAY_NB_ENTRIES_CHOICES
              }
            }, {
              name: 'details.menu_position',
              type: 'enum',
              label: trans('label_menu_position', {}, 'clacoform'),
              required: true,
              options: {
                noEmpty: true,
                choices: constants.MENU_POSITION_CHOICES
              }
            }
          ]
        }, {
          id: 'random',
          icon: 'fa fa-fw fa-random',
          title: trans('random_entries', {}, 'clacoform'),
          fields: []
        }, {
          id: 'list',
          icon: 'fa fa-fw fa-list',
          title: trans('entries_list_search', {}, 'clacoform'),
          fields: []
        }, {
          id: 'metadata',
          icon: 'fa fa-fw fa-user-secret',
          title: trans('metadata', {}, 'clacoform'),
          fields: [
            {
              name: 'details.display_metadata',
              type: 'enum',
              label: trans('label_display_metadata', {}, 'clacoform'),
              required: true,
              options: {
                noEmpty: true,
                choices: constants.DISPLAY_METADATA_CHOICES
              }
            }
          ]
        }, {
          id: 'locked',
          icon: 'fa fa-fw fa-lock',
          title: trans('locked_fields', {}, 'clacoform'),
          fields: [
            {
              name: 'details.locked_fields_for',
              type: 'enum',
              label: trans('lock_fields', {}, 'clacoform'),
              required: true,
              options: {
                noEmpty: true,
                choices: constants.LOCKED_FIELDS_FOR_CHOICES
              }
            }
          ]
        }, {
          id: 'categories',
          icon: 'fa fa-fw fa-columns',
          title: trans('categories'),
          fields: []
        }, {
          id: 'comments',
          icon: 'fa fa-fw fa-comments-o',
          title: trans('comments', {}, 'clacoform'),
          fields: []
        }, {
          id: 'keywords',
          icon: 'fa fa-fw fa-tags',
          title: trans('keywords', {}, 'clacoform'),
          fields: []
        }
      ]}
    />
  </section>

EditorComponent.propTypes = {
  clacoForm: T.shape(ClacoFormType.propTypes),
  canEdit: T.bool.isRequired,
  categories: T.arrayOf(T.shape({
    id: T.number.isRequired,
    name: T.string.isRequired
  })),
  fields: T.arrayOf(T.shape({
    id: T.number.isRequired,
    name: T.string.isRequired,
    hidden: T.bool
  })),
  roles: T.array,
  initializeParameters: T.func.isRequired,
  updateParameters: T.func.isRequired,
  showModal: T.func.isRequired
}

const ClacoFormConfig = connect(
  (state) => ({
    clacoForm: formSelect.data(formSelect.form(state, 'clacoFormForm')),
    canEdit: resourceSelect.editable(state),
    categories: state.categories,
    fields: state.fields,
    roles: state.roles
  }),
  (dispatch) => ({
    initializeParameters: () => dispatch(actions.initializeParameters()),
    updateParameters: (property, value) => dispatch(actions.updateParameters(property, value)),
    showModal: (type, props) => dispatch(modalActions.showModal(type, props))
  })
)(EditorComponent)

export {
  ClacoFormConfig
}