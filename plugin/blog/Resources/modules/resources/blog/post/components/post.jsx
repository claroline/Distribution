import React from 'react'
import {connect} from 'react-redux'
import classes from 'classnames'
import {PropTypes as T} from 'prop-types'
import {trans, transChoice} from '#/main/core/translation'
import {displayDate} from '#/main/core/scaffolding/date'
import {UserAvatar} from '#/main/core/user/components/avatar.jsx'
import {actions as listActions} from '#/main/core/data/list/actions'
import {HtmlText} from '#/main/core/layout/components/html-text.jsx'
import {MODAL_CONFIRM} from '#/main/app/modals/confirm'
import {actions as modalActions} from '#/main/app/overlay/modal/store'
import {Button} from '#/main/app/action/components/button'
import {PostType} from '#/plugin/blog/resources/blog/post/components/prop-types'
import {actions as postActions} from '#/plugin/blog/resources/blog/post/store'
import {Comments} from '#/plugin/blog/resources/blog/comment/components/comments'
import {getCommentsNumber} from '#/plugin/blog/resources/blog/utils.js'

const PostComponent = props =>
  <div className={classes(`data-card data-card-${props.orientation} data-card-${props.size}`)}>
    {props.post.id &&
      <div className="post-container">
        <h1 key="post-header" className={classes('post-header', {'unpublished': !props.post.isPublished})}>
          <a href={`#/${props.post.slug}`}>{props.post.title}</a>
          <InfoBar 
            displayViews={props.displayViews} 
            blogId={props.blogId} 
            getPostsByAuthor={props.getPostsByAuthor} 
            post={props.post} 
            key={`data-card-subtitle-${props.post.id}`} />
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
    <div className="post-dropdown">
      <Button
        id={`actions-${props.post.id}`}
        className="btn btn-link"
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
              callback: () => props.pinPost(props.blogId, props.post.id),
              label: props.post.pinned ? trans('icap_blog_post_unpin', {}, 'icap_blog') : trans('icap_blog_post_pin', {}, 'icap_blog'),
              icon: props.post.pinned ? 'fa fa-thumb-tack' : 'fa fa-thumb-tack'
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
  </div>
    
PostComponent.propTypes = {
  canEdit: T.bool,
  full: T.bool,
  blogId: T.string.isRequired,
  size: T.string,
  canComment: T.bool,
  displayViews: T.bool,
  orientation: T.string,
  showCommentForm: T.bool,
  showComments: T.bool,
  post: T.shape(PostType.propTypes).isRequired,
  getPostsByAuthor: T.func.isRequired,
  publishPost: T.func.isRequired,
  pinPost: T.func.isRequired,
  deletePost: T.func.isRequired
}

const PostCard = props =>
  <PostComponent 
    {...props} 
    post={props.data}
  />

PostCard.propTypes = {
  data: T.shape(PostType.propTypes)
}

const InfoBar = props =>
  <ul className="list-inline post-infos">
    <li 
      onClick={(e) => {
        props.getPostsByAuthor(props.blogId, props.post.author.firstName + ' ' + props.post.author.lastName)
        e.preventDefault()
        e.stopPropagation()
      }}>
      <span>
        <UserAvatar className="user-picture" picture={props.post.author ? props.post.author.picture : undefined} alt={true} /> 
        <a className="read_more">{props.post.author.firstName} {props.post.author.lastName}</a>
      </span>
    </li>
    <li><span className="fa fa-calendar"></span> {displayDate(props.post.publicationDate, false, true)} </li>
    {props.displayViews &&
      <li><span className="fa fa-eye"></span> {transChoice('display_views', props.post.viewCounter, {'%count%': props.post.viewCounter}, 'platform')}</li> 
    }
  </ul>
    
InfoBar.propTypes = {
  getPostsByAuthor: T.func.isRequired,
  blogId: T.string.isRequired,
  post: T.shape(PostType.propTypes),
  displayViews: T.bool
}
    
const Footer = props =>
  <div>
    <ul className='list-inline post-tags pull-left'>
      <li><span className="fa fa-tags"></span></li>
      <li>
        {/*props.post.tags && props.post.tags.length > 0 ? (
          props.post.tags && props.post.tags.map(tag =>(
           { <PostTag key={tag} tag={tag} /> }
          ))
        ) : (
          trans('no_tags', {}, 'icap_blog')
        )*/}
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
        
Footer.propTypes = {
  canEdit:T.bool,
  canComment:T.bool,
  displayViews:T.bool,
  post: T.shape(PostType.propTypes)
}    

const PostCardContainer = connect(
  state => ({
    blogId: state.blog.data.id,
    canEdit: state.canEdit,
    canComment: state.blog.data.options.data.authorizeComment,
    displayViews: state.blog.data.options.data.displayPostViewCounter
  }),
  dispatch => ({
    publishPost: (blogId, postId) => {
      dispatch(postActions.publishPost(blogId, postId))
    },
    pinPost: (blogId, postId) => {
      dispatch(postActions.pinPost(blogId, postId))
    },
    deletePost: (blogId, postId, postName) => {
      dispatch(modalActions.showModal(MODAL_CONFIRM, {
        title: trans('post_deletion_confirm_title', {}, 'icap_blog'),
        question: trans('post_deletion_confirm_message', {'postName': postName}, 'icap_blog'),
        handleConfirm: () => dispatch(postActions.deletePost(blogId, postId))
      }))
    },
    getPostsByAuthor: (blogId, authorName) => {
      dispatch(listActions.addFilter('posts', 'authorName', authorName))
      dispatch(postActions.initDataList())
    }
  })
)(PostCard)
  
const PostContainer = connect(
  state => ({
    data: state.post,
    full: true
  })
)(PostCardContainer)
    
export {PostCardContainer as PostCard, PostContainer as Post}