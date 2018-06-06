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
import {TooltipElement} from '#/main/core/layout/components/tooltip-element'
import {HtmlText} from '#/main/core/layout/components/html-text.jsx'
import {getCommentsNumber} from '#/plugin/blog/resources/blog/utils.js'
import {actions} from '#/plugin/blog/resources/blog/actions.js'
import {actions as listActions} from '#/main/core/data/list/actions'
import {Comments} from '#/plugin/blog/resources/blog/components/comments.jsx'
import {MODAL_CONFIRM} from '#/main/app/modals/confirm'
import {actions as modalActions} from '#/main/app/overlay/modal/store'
import {Button} from '#/main/app/action/components/button'

const PostComponent = props =>
  <div className={classes(`data-card data-card-${props.orientation} data-card-${props.size}`)}>
    {props.post.id &&
      <div className="post-container">
        <h1 key="post-header" className={classes(`post-header`, {'unpublished': !props.post.isPublished})}>
          <a href={`#/${props.post.slug}`}>{props.post.title}</a>
          <InfoBar blogId={props.blogId} getPostsByAuthor={props.getPostsByAuthor} post={props.post} key={`data-card-subtitle-${props.id}`} />
        </h1>
      
        {'sm' !== props.size && props.post.content &&
          <div key="data-card-description" className="post-content">
            <HtmlText>{props.post.content}</HtmlText>
            {props.post.abstract &&
              <div>
                ...
                <div className="read_more">
                  <a href={`#/${props.post.slug}`}>{trans('read_more', {}, 'icap_blog')}</a> <span className="fa fa-long-arrow-right"></span>
                </div>
              </div>
            }
          </div>
        }
        {'sm' !== props.size &&
          <div key="data-card-footer" className="data-card-footer">
            <Footer post={props.post} canEdit={props.canEdit} />
          </div>
        }
        {props.full &&
          <div className="post-content">
            <Comments 
              blogId={props.blogId} 
              postId={props.post.id} 
              canComment={props.canComment} 
              showForm={props.showCommentForm} 
              opened={props.showComments} 
              comments={props.post.comments} 
            />
          </div>
        }
      </div>
    }
    <Button
      id={`actions-${props.id}`}
      className="data-actions-btn btn btn-link"
      type="menu"
      tooltip="left"
      icon="fa fa-fw fa-ellipsis-v"
      label={trans('show-actions', {}, 'actions')}
      menu={{
        label: trans('actions'),
        align: 'right',
        items: [
          {
            type: 'link',
            target: `/${props.post.slug}/edit`,
            label: trans('edit_post_short', {}, 'icap_blog'),
            icon: 'fa fa-pencil'
          },{
            type: 'callback',
            callback: () => props.publishPost(props.blogId, props.post.id),
            label: props.post.isPublished ? trans('icap_blog_post_unpublish', {}, 'icap_blog') : trans('icap_blog_post_publish', {}, 'icap_blog'),
            icon: props.post.isPublished ? 'fa fa-eye-slash' : 'fa fa-eye'
          },{
            type: 'callback',
            callback: () => props.deletePost(props.blogId, props.post.id, props.post.title),
            label: trans('delete', {}, 'platform'),
            icon: 'fa fa-trash'
          }
        ]
      }}
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
        <UserAvatar className="user-picture" picture={props.post.author ? props.post.author.picture : undefined} alt={true} /> 
         <a className="read_more">{props.post.author.firstName} {props.post.author.lastName}</a>
      </span>
    </li>
    <li><span className="fa fa-calendar"></span> {displayDate(props.post.publicationDate, false, true)} </li>
    <li><span className="fa fa-eye"></span> {transChoice('display_views', props.post.viewCounter, {'%count%': props.post.viewCounter}, 'platform')}</li> 
  </ul>
    
const Footer = props =>
  <div>
    <ul className='list-inline post-tags pull-left'>
      <li><span className="fa fa-tags"></span></li>
      <li>
      {props.post.tags && props.post.tags.length > 0 ? (
         props.post.tags && props.post.tags.map(tag =>(
           <PostTag key={tag} tag={tag} />
          ))
        ) : (
          trans('no_tags', {}, 'icap_blog')
        )}
      </li>
    </ul>
    <ul className='list-inline pull-right'>
      <li><span className="fa fa-comments"></span></li>
      <li>
        {getCommentsNumber(props.canEdit, props.post.commentsNumber, props.post.commentsNumberUnpublished) > 0
          ? transChoice('comments_number', getCommentsNumber(props.canEdit, props.post.commentsNumber, props.post.commentsNumberUnpublished), 
              {'%count%': getCommentsNumber(props.canEdit, props.post.commentsNumber, props.post.commentsNumberUnpublished)}, 'icap_blog')
          : trans('no_comment', {}, 'icap_blog')}
        {props.canEdit && props.post.commentsNumberUnpublished 
          ? transChoice('comments_pending', props.post.commentsNumberUnpublished, {'%count%': props.post.commentsNumberUnpublished}, 'icap_blog')
          : ''}
      </li>
    </ul>
  </div>

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
    blogId: state.blog.data.id,
    canEdit: state.canEdit
  }),
  dispatch => ({
    publishPost: (blogId, postId) => {
      dispatch(actions.publishPost(blogId, postId))
    },
    deletePost: (blogId, postId, postName) => {
      dispatch(modalActions.showModal(MODAL_CONFIRM, {
        title: trans('post_deletion_confirm_title', {}, 'icap_blog'),
        question: trans('post_deletion_confirm_message', {'postName': postName}, 'icap_blog'),
        handleConfirm: () => dispatch(actions.deletePost(blogId, postId))
      }))
    },
    getPostsByAuthor: (blogId, authorName) => {
      dispatch(listActions.addFilter('posts', 'authorName', authorName));
      dispatch(actions.initDataList());
    }
  })
)(PostCard)
  
const PostContainer = connect(
  state => ({
      canComment: true,
      data: state.post,
      full: true
    })
)(PostCardContainer)
    
export {PostCardContainer as PostCard, PostContainer as Post}