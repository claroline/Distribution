import React from 'react'
import {connect} from 'react-redux'
import {PropTypes as T} from 'prop-types'
import {select as formSelect} from '#/main/core/data/form/selectors'
import {actions as formActions} from '#/main/core/data/form/actions'
import {FormContainer} from '#/main/core/data/form/containers/form.jsx'
import {FormGroup} from '#/main/core/layout/form/components/group/form-group.jsx'
import PanelGroup from 'react-bootstrap/lib/PanelGroup'
import Panel from 'react-bootstrap/lib/Panel'
import {t, trans} from '#/main/core/translation'
import {BlogOptionsType} from '#/plugin/blog/resources/blog/prop-types'

import {constants} from '#/plugin/blog/resources/blog/constants.js'

const BlogOptionsComponent = props =>
  <section className="resource-section">
    <h2 className="h-first">{trans('configure_blog', {}, 'icap_blog')}</h2>
    <FormContainer
      level={2}
      name="blog.data.options"
      sections={[
        {
          id: 'options',
          title: 'Blog options',
          primary: true,
          fields: [
            {
              name: 'displayTitle',
              type: 'boolean',
              label: trans('icap_blog_options_form_display_title', {}, 'icap_blog'),
            },{
              name: 'displayPostViewCounter',
              type: 'boolean',
              label: trans('icap_blog_options_form_display_post_view_counter', {}, 'icap_blog'),
            },{
              name: 'authorizeComment',
              type: 'boolean',
              label: trans('icap_blog_options_form_authorize_comment', {}, 'icap_blog'),
            },{
              name: 'authorizeAnonymousComment',
              type: 'boolean',
              label: trans('icap_blog_options_form_authorize_anonymous_comment', {}, 'icap_blog'),
            },{
              name: 'autoPublishPost',
              type: 'boolean',
              label: trans('icap_blog_options_form_auto_publish_post', {}, 'icap_blog'),
            },{
              name: 'autoPublishComment',
              type: 'boolean',
              label: trans('icap_blog_options_form_auto_publish_comment', {}, 'icap_blog'),
            },{
              name: 'postPerPage',
              type: 'enum',
              label: trans('icap_blog_options_form_post_per_page', {}, 'icap_blog'),
              required: true,
              options: {
                noEmpty: true,
                choices: constants.PAGE_SIZE
              }
            }
          ]
        },{
          id: 'tag-cloud',
          icon: 'fa fa-fw fa-cloud',
          title: trans('tag_cloud', {}, 'icap_blog'),
          fields: [
            {
              name: 'tagCloud',
              type: 'enum',
              required: true,
              label: trans('icap_blog_options_form_tag_cloud', {}, 'icap_blog'),
              options: {
                noEmpty: true,
                choices: constants.TAGCLOUD_TYPE
              }
            },{
              name: 'tagTopMode',
              type: 'boolean',
              label: trans('limit_to_tags', {}, 'icap_blog'),
              linked: [
                {
                  name: 'maxTag',
                  type: 'number',
                  label: trans('limit_to_number', {}, 'icap_blog'),
                  required: true,
                  displayed: props.options.tagTopMode,
                  options: {
                    max: 100
                  }
                }
              ]
            }
          ]
        },{
          id: 'widgets',
          icon: 'fa fa-fw fa-bars',
          title: trans('icap_blog_options_form_Order_Widget_Right', {}, 'icap_blog'),
          fields: [
            {
              name: 'infos',
              type: 'html',
              label: trans('infobar', {}, 'icap_blog'),
            },
            {
              name: 'autoPublishPost',
              type: 'boolean',
              label: 'test1',
            }
          ]
        }
      ]}
    >
    </FormContainer>
  </section>
    
BlogOptionsComponent.propTypes = {
  options: T.shape(BlogOptionsType.propTypes),
}

const BlogOptions = connect(
    state => ({
      options: formSelect.data(formSelect.form(state, 'blog.data.options'))
    })
  )(BlogOptionsComponent)

export {BlogOptions}