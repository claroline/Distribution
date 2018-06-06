import React from 'react'
import {connect} from 'react-redux'
import {PropTypes as T} from 'prop-types'
import {FormContainer} from '#/main/core/data/form/containers/form.jsx'
import {FormSections, FormSection} from '#/main/core/layout/form/components/form-sections.jsx'
import {FormGroup} from '#/main/core/layout/form/components/group/form-group.jsx'
import TagsEditor from '#/plugin/tag/item-tags-editor.jsx'
import {t} from '#/main/core/translation'
import {FormPageActionsContainer} from '#/main/core/data/form/containers/page-actions.jsx'
import {HtmlGroup} from '#/main/core/layout/form/components/group/html-group.jsx'
import {TextGroup} from '#/main/core/layout/form/components/group/text-group.jsx'
import {Textarea} from '#/main/core/layout/form/components/field/textarea.jsx'
import {navigate} from '#/main/app/router'
import {actions} from '#/plugin/blog/resources/blog/actions.js'
import {constants} from '#/plugin/blog/resources/blog/constants.js'
import isEmpty from 'lodash/isEmpty'
import {Redirect } from 'react-router'

const PostFormComponent = props =>
  <div>
    {props.goHome &&
      <Redirect to={'/'} />
    }
    {(props.mode === constants.CREATE_POST || !isEmpty(props.post.data)) &&
      <FormContainer
        name="post_edit"
        sections={[
          {
            id: 'Post',
            title: 'Post form',
            primary: true,
            fields: [
              {
                name: 'title',
                type: 'string',
                label: 'Title',
                required: true
              },{
                name: 'publicationDate',
                type: 'date',
                label: 'Publication date',
                required: true
              },{
                name: 'content',
                type: 'html',
                label: 'Content',
                required: true,
                options: {
                  minRows: 6
                }
              }
            ]
          }
        ]}
      >
        <FormSections
          level={3}
        >
          <FormSection
            id="tags"
            icon="fa fa-fw fa-user"
            title={t('tags')}
          >
            <TagsEditor
              item={props.tags}
            />
          </FormSection>
        </FormSections>
      </FormContainer>
    }
  </div>

PostFormComponent.propTypes = {
}

const PostForm = connect(
    state => ({
      mode: state.mode,
      post: state.post_edit,
      tags: state.blog.data.tags,
      goHome: state.goHome
    })
)(PostFormComponent)

export {PostForm}