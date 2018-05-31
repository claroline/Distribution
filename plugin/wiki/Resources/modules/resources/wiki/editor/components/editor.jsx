import React from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'

import {trans} from '#/main/core/translation'
import {select as formSelect} from '#/main/core/data/form/selectors'
import {actions as formActions} from '#/main/core/data/form/actions'
import {FormContainer} from '#/main/core/data/form/containers/form.jsx'

import {WikiType} from '#/plugin/wiki/resources/wiki/prop-types'
import {WIKI_MODES} from '#/plugin/wiki/resources/wiki/constants'

const EditorComponent = () =>
  <section className="resource-section">
    <h2>{trans('configuration', {}, 'platform')}</h2>
    <FormContainer
      level={3}
      name="wikiForm"
      sections={[
        {
          title: trans('general', {}, 'platform'),
          primary: true,
          fields: [
            {
              name: 'mode',
              type: 'choice',
              label: trans('icap_wiki_options_type_mode', {}, 'icap_wiki'),
              required: true,
              options: {
                noEmpty: true,
                condensed: false,
                choices: WIKI_MODES
              }
            }, {
              name: 'displaySectionNumbers',
              type: 'boolean',
              label: trans('display_section_numbers', {}, 'icap_wiki')
            }
          ]
        }
      ]}
    />
  </section>

EditorComponent.propTypes = {
  wiki: T.shape(WikiType.propTypes),
  updateProp: T.func.isRequired
}

const Editor = connect(
  state => ({
    wiki: formSelect.data(formSelect.form(state, 'wikiForm'))
  }),
  dispatch => ({
    updateProp(propName, propValue) {
      dispatch(formActions.updateProp('wikiForm', propName, propValue))
    }
  })
)(EditorComponent)

export {
  Editor
}
