import React from 'react'
import {connect} from 'react-redux'
import {PropTypes as T} from 'prop-types'

import {trans} from '#/main/core/translation'
import {select as formSelect} from '#/main/core/data/form/selectors'
import {FormContainer} from '#/main/core/data/form/containers/form.jsx'

import {ClacoForm as ClacoFormType} from '#/plugin/claco-form/resources/claco-form/prop-types'
import {constants} from '#/plugin/claco-form/resources/claco-form/constants'

const generateDisplayList = (fields) => {
  const displayList = {
    title: trans('title'),
    date: trans('date'),
    user: trans('user'),
    categories: trans('categories'),
    keywords: trans('keywords', {}, 'clacoform')
  }

  fields.filter(f => !f.hidden).map(field => {
    displayList[field.id] = field.name
  })

  return displayList
}

const EditorComponent = props =>
  <section className="resource-section">
    <h2>{trans('configuration', {}, 'platform')}</h2>
    <FormContainer
      level={3}
      name="clacoFormForm"
      sections={[
        {
          id: 'fields',
          icon: 'fa fa-fw fa-th-list',
          title: trans('fields', {}, 'clacoform'),
          fields: []
        }, {
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
          fields: [
            {
              name: 'details.random_enabled',
              type: 'boolean',
              label: trans('label_random_enabled', {}, 'clacoform'),
              required: true,
              linked: [
                {
                  name: 'details.random_categories',
                  type: 'enum',
                  label: trans('label_random_categories', {}, 'clacoform'),
                  displayed: props.clacoForm.details.random_enabled,
                  required: false,
                  options: {
                    multiple: true,
                    choices: props.clacoForm.categories.reduce((acc, cat) => {
                      acc[cat.id] = cat.name

                      return acc
                    }, {})
                  }
                }, {
                  name: 'details.random_start_date',
                  type: 'date',
                  label: trans('label_random_start_date', {}, 'clacoform'),
                  displayed: props.clacoForm.details.random_enabled,
                  required: true
                },
                {
                  name: 'details.random_end_date',
                  type: 'date',
                  label: trans('label_random_end_date', {}, 'clacoform'),
                  displayed: props.clacoForm.details.random_enabled,
                  required: true
                }
              ]
            }
          ]
        }, {
          id: 'list',
          icon: 'fa fa-fw fa-list',
          title: trans('entries_list_search', {}, 'clacoform'),
          fields: [
            {
              name: 'details.search_enabled',
              type: 'boolean',
              label: trans('label_search_enabled', {}, 'clacoform'),
              required: true
            }, {
              name: 'details.search_column_enabled',
              type: 'boolean',
              label: trans('label_search_column_enabled', {}, 'clacoform'),
              required: true
            }, {
              name: 'details.search_columns',
              type: 'enum',
              label: trans('label_search_columns', {}, 'clacoform'),
              required: false,
              options: {
                multiple: true,
                choices: generateDisplayList(props.clacoForm.fields)
              }
            }, {
              name: 'details.default_display_mode',
              type: 'enum',
              label: trans('default_display_mode', {}, 'clacoform'),
              required: true,
              options: {
                noEmpty: true,
                choices: constants.DISPLAY_MODES_CHOICES
              }
            }, {
              name: 'details.display_title',
              type: 'enum',
              label: trans('field_for_title', {}, 'clacoform'),
              required: true,
              options: {
                noEmpty: true,
                choices: generateDisplayList(props.clacoForm.fields)
              }
            }, {
              name: 'details.display_subtitle',
              type: 'enum',
              label: trans('field_for_subtitle', {}, 'clacoform'),
              required: true,
              options: {
                noEmpty: true,
                choices: generateDisplayList(props.clacoForm.fields)
              }
            }, {
              name: 'details.display_content',
              type: 'enum',
              label: trans('field_for_content', {}, 'clacoform'),
              required: true,
              options: {
                noEmpty: true,
                choices: generateDisplayList(props.clacoForm.fields)
              }
            }
          ]
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
          icon: 'fa fa-fw fa-table',
          title: trans('categories'),
          fields: [
            {
              name: 'details.display_categories',
              type: 'boolean',
              label: trans('label_display_categories', {}, 'clacoform'),
              required: true
            }
          ]
        }, {
          id: 'comments',
          icon: 'fa fa-fw fa-comments-o',
          title: trans('comments', {}, 'clacoform'),
          fields: [
            {
              name: 'details.comments_enabled',
              type: 'boolean',
              label: trans('label_comments_enabled', {}, 'clacoform'),
              required: true,
              linked: [
                {
                  name: 'details.comments_roles',
                  type: 'enum',
                  label: trans('enable_comments_for_roles', {}, 'clacoform'),
                  displayed: props.clacoForm.details.comments_enabled,
                  required: false,
                  options: {
                    multiple: true,
                    choices: props.roles.reduce((acc, r) => {
                      acc[r.name] = trans(r.translationKey)

                      return acc
                    }, {})
                  }
                }, {
                  name: 'details.moderate_comments',
                  type: 'enum',
                  label: trans('label_moderate_comments', {}, 'clacoform'),
                  displayed: props.clacoForm.details.comments_enabled,
                  required: true,
                  options: {
                    noEmpty: true,
                    choices: constants.MODERATE_COMMENTS_CHOICES
                  }
                }, {
                  name: 'details.display_comments',
                  type: 'boolean',
                  label: trans('label_display_comments', {}, 'clacoform'),
                  displayed: props.clacoForm.details.comments_enabled,
                  required: true,
                  linked: [
                    {
                      name: 'details.comments_display_roles',
                      type: 'enum',
                      label: trans('display_comments_for_roles', {}, 'clacoform'),
                      displayed: props.clacoForm.details.comments_enabled && props.clacoForm.details.display_comments,
                      required: false,
                      options: {
                        multiple: true,
                        choices: props.roles.reduce((acc, r) => {
                          acc[r.name] = trans(r.translationKey)

                          return acc
                        }, {})
                      }
                    }, {
                      name: 'details.open_comments',
                      type: 'boolean',
                      label: trans('label_open_panel_by_default', {}, 'clacoform'),
                      displayed: props.clacoForm.details.comments_enabled && props.clacoForm.details.display_comments,
                      required: true
                    }, {
                      name: 'details.display_comment_author',
                      type: 'boolean',
                      label: trans('label_display_comment_author', {}, 'clacoform'),
                      displayed: props.clacoForm.details.comments_enabled && props.clacoForm.details.display_comments,
                      required: true
                    }, {
                      name: 'details.display_comment_date',
                      type: 'boolean',
                      label: trans('label_display_comment_date', {}, 'clacoform'),
                      displayed: props.clacoForm.details.comments_enabled && props.clacoForm.details.display_comments,
                      required: true
                    }
                  ]
                }
              ]
            }
          ]
        }, {
          id: 'keywords',
          icon: 'fa fa-fw fa-font',
          title: trans('keywords', {}, 'clacoform'),
          fields: [
            {
              name: 'details.keywords_enabled',
              type: 'boolean',
              label: trans('label_keywords_enabled', {}, 'clacoform'),
              required: true,
              linked: [
                {
                  name: 'details.new_keywords_enabled',
                  type: 'boolean',
                  label: trans('label_new_keywords_enabled', {}, 'clacoform'),
                  displayed: props.clacoForm.details.keywords_enabled,
                  required: true
                }, {
                  name: 'details.display_keywords',
                  type: 'boolean',
                  label: trans('label_display_keywords', {}, 'clacoform'),
                  displayed: props.clacoForm.details.keywords_enabled,
                  required: true
                }
              ]
            }
          ]
        }
      ]}
    />
  </section>

EditorComponent.propTypes = {
  clacoForm: T.shape(ClacoFormType.propTypes),
  roles: T.array
}

const Editor = connect(
  (state) => ({
    clacoForm: formSelect.data(formSelect.form(state, 'clacoFormForm')),
    roles: state.roles
  })
)(EditorComponent)

export {
  Editor
}