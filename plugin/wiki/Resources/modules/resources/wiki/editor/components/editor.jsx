import React from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'

import {trans} from '#/main/core/translation'
import {select as formSelect} from '#/main/core/data/form/selectors'
import {FormContainer} from '#/main/core/data/form/containers/form.jsx'

import {Wiki as WikiTypes} from '#/plugin/wiki/resources/wiki/prop-types'
import {WIKI_MODES, WIKI_MODE_CHOICES} from '#/plugin/wiki/resources/wiki/constants'

const EditorComponent = props =>
  <FormContainer
    level={2}
    title={trans('configuration', {}, 'actions')}
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
            help: trans(WIKI_MODES[props.wiki.mode]+'_message', {}, 'icap_wiki'),
            required: true,
            options: {
              noEmpty: true,
              condensed: false,
              choices: WIKI_MODE_CHOICES
            }
          }, {
            name: 'displaySectionNumbers',
            help: trans('display_section_numbers_message', {}, 'icap_wiki'),
            type: 'boolean',
            label: trans('display_section_numbers', {}, 'icap_wiki')
          }
        ]
      }
    ]}
  />

EditorComponent.propTypes = {
  wiki: T.shape(WikiTypes.propTypes)
}

const Editor = connect(
  state => ({
    wiki: formSelect.data(formSelect.form(state, 'wikiForm'))
  })
)(EditorComponent)

export {
  Editor
}
