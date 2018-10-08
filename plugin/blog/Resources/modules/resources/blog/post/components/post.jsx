import React from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'
import classes from 'classnames'
import isEmpty from 'lodash/isEmpty'
import get from 'lodash/get'

// TODO : remove me
import ButtonToolbar from 'react-bootstrap/lib/ButtonToolbar'

import {trans, transChoice} from '#/main/core/translation'
import {displayDate} from '#/main/core/scaffolding/date'
import {UserAvatar} from '#/main/core/user/components/avatar'
import {hasPermission} from '#/main/core/resource/permissions'
import {selectors as resourceSelect} from '#/main/core/resource/store'
import {HtmlText} from '#/main/core/layout/components/html-text'
import {UrlButton} from '#/main/app/buttons/url/components/button'
import {actions as modalActions} from '#/main/app/overlay/modal/store'
import {MODAL_CONFIRM} from '#/main/app/modals/confirm'
import {Button} from '#/main/app/action/components/button'
import {CALLBACK_BUTTON, LINK_BUTTON} from '#/main/app/buttons'
import {selectors} from '#/plugin/blog/resources/blog/store'
import {PostType} from '#/plugin/blog/resources/blog/post/components/prop-types'
import {actions as postActions} from '#/plugin/blog/resources/blog/post/store'
import {Comments} from '#/plugin/blog/resources/blog/comment/components/comments'
import {getCommentsNumber, splitArray} from '#/plugin/blog/resources/blog/utils'
import {withRouter} from '#/main/app/router'
import {updateQueryParameters} from '#/plugin/blog/resources/blog/utils'

const PostComponent = props =>
  <div className='data-card-blog'>
    {props.post.id &&
      <div>
        <div className="post-container">
          <div className={classes('post-header')}>
            <h2 className={'post-title'}>
              <a href={`#/${props.post.slug}`}>{props.post.title}</a>
            </h2>
            <InfoBar
              {...props}
              displayViews={props.displayViews}
              blogId={props.blogId}
              getPostsByAuthor={props.getPostsByAuthor}
              post={props.post}
              key={`data-card-subtitle-${props.post.id}`} />
            <ActionBar
              blogId={props.blogId}
              post={props.post}
              canEdit={props.canEdit}
              canModerate={props.canModerate}
              publishPost={props.publishPost}
              pinPost={props.pinPost}
              deletePost={props.deletePost}
            />
          </div>
          {'sm' !== props.size && props.post.content &&
            <div key="data-card-description" className="post-content">
              <HtmlText>{props.post.content}</HtmlText>
              {props.post.abstract &&
                <div>
                  ...
                  <div className="read_more">
                    <a href={`#/${props.post.slug}`}>{trans('read_more', {}, 'icap_blog')}</a> <span className="fa fa-lg fa-arrow-circle-right"></span>
                  </div>
                </div>
              }
            </div>
          }
          {'sm' !== props.size &&
            <div key="data-card-footer" className="data-card-footer">
              <Footer
                {...props}
                post={props.post}
                canEdit={props.canEdit} />
            </div>
          }
          {props.full && props.canComment &&
            <div className="post-content">
              <Comments
                blogId={props.blogId}
                postId={props.post.id}
                canComment={props.canComment}
                canAnonymousComment={props.canAnonymousComment}
                showForm={props.showCommentForm}
                opened={props.showComments}
                commentNumber={getCommentsNumber(props.canEdit, props.post.commentsNumber, props.post.commentsNumberUnpublished)}
              />
            </div>
          }
        </div>
      </div>
    }
  </div>

PostComponent.propTypes = {
  canEdit: T.bool,
  full: T.bool,
  blogId: T.string.isRequired,
  size: T.string,
  canComment: T.bool,
  canModerate: T.bool,
  canAnonymousComment:T.bool,
  displayViews: T.bool,
  orientation: T.string,
  showCommentForm: T.bool,
  showComments: T.bool,
  post: T.shape(PostType.propTypes).isRequired,
  getPostsByAuthor: T.func.isRequired,
  publishPost: T.func.isRequired,
  pinPost: T.func.isRequired,
  deletePost: T.func.isRequired,
  commentNumber: T.number
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
        props.getPostsByAuthor(props.history, props.location.search, props.blogId, props.post.author.firstName + ' ' + props.post.author.lastName)
        e.preventDefault()
        e.stopPropagation()
      }}>
      <span>
        <UrlButton target={['claro_user_profile', {user: get(props.post.author, 'meta.publicUrl')}]}>
          <UserAvatar className="user-picture" picture={props.post.author ? props.post.author.picture : undefined} alt={true} />
        </UrlButton>
        <a className="user-name link">{props.post.author.firstName} {props.post.author.lastName}</a>
      </span>
    </li>
    <li><span className="fa fa-calendar"></span> {displayDate(props.post.publicationDate, false, false)} </li>
    {props.displayViews &&
      <li><span className="fa fa-eye"></span> {transChoice('display_views', props.post.viewCounter, {'%count%': props.post.viewCounter}, 'platform')}</li>
    }
    {props.post.pinned &&
      <li><span className="label label-success">{trans('icap_blog_post_pinned', {}, 'icap_blog')}</span></li>
    }
    {!props.post.isPublished &&
    <li><span className="label label-danger">{props.post.status ? trans('unpublished_date', {}, 'icap_blog') : trans('unpublished', {}, 'icap_blog')}</span></li>
    }
  </ul>

InfoBar.propTypes = {
  getPostsByAuthor: T.func.isRequired,
  blogId: T.string.isRequired,
  post: T.shape(PostType.propTypes),
  displayViews: T.bool,
  history: T.object,
  location: T.object
}

const ActionBar = props =>
  <ButtonToolbar className="post-actions">
    {props.canEdit &&
      <Button
        id={`action-edit-${props.post.id}`}
        type={LINK_BUTTON}
        icon="fa fa-pencil"
        className="btn btn-link post-button"
        tooltip="top"
        label={trans('edit_post_short', {}, 'icap_blog')}
        title={trans('edit_post_short', {}, 'icap_blog')}
        target={`/${props.post.slug}/edit`}
      />
    }
    {(props.canEdit || props.canModerate) &&
      <Button
        id={`action-publish-${props.post.id}`}
        type={CALLBACK_BUTTON}
        icon={props.post.status ? 'fa fa-eye' : 'fa fa-eye-slash'}
        className="btn btn-link post-button"
        tooltip="top"
        label={props.post.status ? trans('icap_blog_post_unpublish', {}, 'icap_blog') : trans('icap_blog_post_publish', {}, 'icap_blog')}
        title={props.post.status ? trans('icap_blog_post_unpublish', {}, 'icap_blog') : trans('icap_blog_post_publish', {}, 'icap_blog')}
        callback={() => props.publishPost(props.blogId, props.post.id)}
      />
    }
    {(props.canEdit) &&
      <Button
        id={`action-pin-${props.post.id}`}
        type={CALLBACK_BUTTON}
        icon={props.post.pinned ? 'fa fa-thumb-tack' : 'fa fa-thumb-tack fa-rotate-90'}
        className="btn btn-link post-button"
        tooltip="top"
        label={props.post.pinned ? trans('icap_blog_post_unpin', {}, 'icap_blog') : trans('icap_blog_post_pin', {}, 'icap_blog')}
        title={props.post.pinned ? trans('icap_blog_post_unpin', {}, 'icap_blog') : trans('icap_blog_post_pin', {}, 'icap_blog')}
        callback={() => props.pinPost(props.blogId, props.post.id)}
      />
    }
    {props.canEdit &&
      <Button
        id={`action-delete-${props.post.id}`}
        type={CALLBACK_BUTTON}
        icon="fa fa-trash"
        className="btn btn-link post-button"
        tooltip="top"
        label={trans('delete', {}, 'platform')}
        title={trans('delete', {}, 'platform')}
        dangerous={true}
        callback={() => props.deletePost(props.blogId, props.post.id, props.post.title)}
      />
    }

  </ButtonToolbar>

ActionBar.propTypes = {
  canEdit:T.bool,
  canModerate:T.bool,
  post: T.shape(PostType.propTypes),
  blogId: T.string.isRequired,
  publishPost: T.func.isRequired,
  deletePost: T.func.isRequired,
  pinPost: T.func.isRequired
}

const Footer = props =>
  <div>
    <ul className='list-inline post-tags pull-left'>
      <li><span className="fa fa-tags"></span></li>
      {!isEmpty(props.post.tags) ? (
        splitArray(props.post.tags).map((tag, index) =>(
          <li key={index}>
            <a className='link' onClick={() => {
              props.getPostsByTag(props.history, props.location.search, tag)
            }}>{tag}</a>
          </li>
        ))
      ) : (
        trans('no_tags', {}, 'icap_blog')
      )}
    </ul>
    <ul className='list-inline pull-right'>
      <li><span className="fa fa-comments"></span></li>
      <li>
        <a href={`#/${props.post.slug}`}>
          {getCommentsNumber(props.canEdit, props.post.commentsNumber, props.post.commentsNumberUnpublished) > 0
            ? transChoice('comments_number', getCommentsNumber(props.canEdit, props.post.commentsNumber, props.post.commentsNumberUnpublished),
              {'%count%': getCommentsNumber(props.canEdit, props.post.commentsNumber, props.post.commentsNumberUnpublished)}, 'icap_blog')
            : trans('no_comment', {}, 'icap_blog')}
          {props.canEdit && props.post.commentsNumberUnpublished
            ? transChoice('comments_pending', props.post.commentsNumberUnpublished, {'%count%': props.post.commentsNumberUnpublished}, 'icap_blog')
            : ''}
        </a>
      </li>
    </ul>
  </div>

Footer.propTypes = {
  commentNumber: T.number,
  canEdit:T.bool,
  canModerate:T.bool,
  canComment:T.bool,
  canAnonymousComment:T.bool,
  displayViews:T.bool,
  getPostsByTag:T.func.isRequired,
  post: T.shape(PostType.propTypes),
  history: T.object,
  location: T.object
}

const PostCardContainer = withRouter(connect(
  (state) => ({
    blogId: selectors.blog(state).data.id,
    canEdit: hasPermission('edit', resourceSelect.resourceNode(state)),
    canModerate: hasPermission('moderate', resourceSelect.resourceNode(state)),
    canComment: selectors.blog(state).data.options.data.authorizeComment,
    canAnonymousComment: selectors.blog(state).data.options.data.authorizeAnonymousComment,
    displayViews: selectors.blog(state).data.options.data.displayPostViewCounter,
    commentsLoaded: !selectors.comments(state).invalidated
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
    getPostsByAuthor: (history, querystring, blogId, authorName) => {
      history.push(updateQueryParameters(querystring, 'author', authorName))
    },
    getPostsByTag: (history, querystring, tag) => {
      history.push(updateQueryParameters(querystring, 'tags', tag))
    }
  })
)(PostCard))

const PostContainer = connect(
  state => ({
    data: selectors.post(state),
    full: true
  })
)(PostCardContainer)

export {PostCardContainer as PostCard, PostContainer as Post}
