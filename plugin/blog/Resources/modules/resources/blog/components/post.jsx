import React from 'react'
import {connect} from 'react-redux'
import classes from 'classnames'
import {PropTypes as T} from 'prop-types'
import {t, trans, transChoice} from '#/main/core/translation'
import {asset} from '#/main/core/scaffolding/asset'
import {displayDate} from '#/main/core/scaffolding/date'
import {UserAvatar} from '#/main/core/user/components/avatar.jsx'
import {DataCard} from '#/main/core/data/components/data-card'
import {ResourceCard} from '#/main/core/resource/data/components/resource-card'
import {getPlainText} from '#/main/core/data/types/html/utils'
import {ActionDropdownButton} from '#/main/core/layout/action/components/dropdown'
import {TooltipElement} from '#/main/core/layout/components/tooltip-element'
import {HtmlText} from '#/main/core/layout/components/html-text.jsx'
import {generatePostActions} from '#/plugin/blog/resources/blog/utils.js'
import {actions} from '#/plugin/blog/resources/blog/actions.js'
import {navigate} from '#/main/core/router'
import {actions as listActions} from '#/main/core/data/list/actions'

const PostComponent = props =>
  <div className={classes(`data-card data-card-${props.orientation} data-card-${props.size}`, props.className)}>
    {props.post.id &&
      <CardContent
        disabled={props.primaryAction && props.primaryAction.disabled}
        action={props.primaryAction && props.primaryAction.action}
      >
        {React.createElement(`h1`, {
          key: 'post-header',
          className: 'post-header'
        }, [
          props.post.title,
          <InfoBar blogId={props.blogId} getPostsByAuthor={props.getPostsByAuthor} post={props.post} key={`data-card-subtitle-${props.id}`} />
        ])}
      
        {'sm' !== props.size && props.post.content &&
          <div key="data-card-description" className="post-content">
            <HtmlText>{props.post.content}</HtmlText>
            {props.post.abstract &&
              <div>
                ...
                <div className="read_more">{trans('read_more', {}, 'icap_blog')} <span className="fa fa-long-arrow-right"></span></div>
              </div>
            }
          </div>
        }
        {'sm' !== props.size &&
          <div key="data-card-footer" className="data-card-footer">
            <Footer post={props.post} />
          </div>
        }
      </CardContent>
    }
    <ActionDropdownButton
      id={`${props.id}-btn`}
      className="data-actions-btn btn-link-default"
      bsStyle="link"
      noCaret={true}
      pullRight={true}
      actions={[
        {
          action: () => navigate(`/post/${props.post.slug}/edit`),
          label: trans('edit_post_short', {}, 'icap_blog'),
          icon: 'fa fa-pencil'
        },{
          action: () => props.publishPost(props.blogId, props.post.id),
          label: props.post.isPublished ? trans('icap_blog_post_unpublish', {}, 'icap_blog') : trans('icap_blog_post_publish', {}, 'icap_blog'),
          icon: props.post.isPublished ? 'fa-eye-slash fa' : 'fa fa-eye'
        }
      ]}
    />
  </div>
    
PostComponent.propTypes = {
  post: T.shape({
    id: T.string,
    title: T.string,
    authorPicture: T.string,
    creationDate: T.string,
    author: T.Object,
    viewCounter: T.number,
    isPublished: T.bool
  }),
}

const PostCard = props =>
  <PostComponent 
    {...props} 
    post={props.data}
  />

const InfoBar = props =>
  <ul className="list-inline post-infos">
    <li 
      onClick={(e) => {
      props.getPostsByAuthor(props.blogId, props.post.author.firstName + " " + props.post.author.lastName)
      e.preventDefault()
      e.stopPropagation()
    }}>
      <span>
        <UserAvatar className="user-picture" picture={props.post.author ? props.post.author.picture : undefined} alt={true} /> <span className="read_more">{props.post.author.firstName} {props.post.author.lastName}</span>
      </span>
    </li>
    <li><span className="fa fa-calendar"></span> {displayDate(props.post.creationDate, false, true)} </li>
    <li><span className="fa fa-eye"></span> {transChoice('display_views', props.post.viewCounter, {'%count%': props.post.viewCounter}, 'platform')}</li> 
  </ul>
    
const Footer = props =>
  <ul className='list-inline'>
    <li><span className="fa fa-tags"></span></li>
    {props.post.tags && props.post.tags.length > 0 ? (
       props.post.tags && props.post.tags.map(tag =>(
         <PostTag key={tag} tag={tag} />
        ))
      ) : (
        trans('no_tags', {}, 'icap_blog')
      )}
  </ul>

const CardContent = props => {
  if (!props.action || props.disabled) {
    return (
      <div className="data-card-content">
        {props.children}
      </div>
    )
  } else {
    if (typeof props.action === 'string') {
      return (
        <a role="link" href={props.action} className="data-card-content">
          {props.children}
        </a>
      )
    } else {
      return (
        <a role="button" onClick={props.action} className="data-card-content">
          {props.children}
        </a>
      )
    }
  }
}

const PostCardContainer = connect(
  state => ({
    blogId: state.blog.data.id
  }),
  dispatch => ({
    publishPost: (blogId, postId) => {
      dispatch(actions.publishPost(blogId, postId))
    },
    getPostsByAuthor: (blogId, authorName) => {
      dispatch(listActions.addFilter('posts', 'authorName', authorName));
      dispatch(actions.initDataList());
    }
  })
)(PostCard)
  
const PostContainer = connect(
  state => ({
      data: state.post
    })
)(PostCardContainer)
    
export {PostCardContainer as PostCard, PostContainer as Post}