import React from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'
import {withRouter} from 'react-router-dom'
import classes from 'classnames'

import {t} from '#/main/core/translation'
import {localeDate} from '#/main/core/layout/data/types/date/utils'
import {User as UserTypes} from '#/main/core/layout/user/prop-types'

import {UserMicro} from '#/main/core/layout/user/components/user-micro.jsx'
import {TooltipButton} from '#/main/core/layout/button/components/tooltip-button.jsx'
import {TooltipLink} from '#/main/core/layout/button/components/tooltip-link.jsx'
import {HtmlText} from '#/main/core/layout/components/html-text.jsx'
import {ResourceContainer} from '#/main/core/layout/resource/containers/resource.jsx'

import {MODAL_CONFIRM, MODAL_DELETE_CONFIRM} from '#/main/core/layout/modal'
import {actions as modalActions} from '#/main/core/layout/modal/actions'
import {actions} from './../actions'
import {select} from './../selectors'

const AnnouncePost = props =>
  <div className={classes('announce-post panel panel-default', {
    'active-post': props.active
  })}>
    <div className="announce-content panel-body">
      {props.title &&
      <h2>{props.title}</h2>
      }

      <div className="announce-meta">
        <div className="announce-info">
          {props.announcer ?
            <UserMicro name={props.announcer} /> :
            <UserMicro {...props.meta.creator} />
          }

          <div className="date">
            {props.meta.publishedAt ?
              t('published_at', {date: localeDate(props.meta.publishedAt)}) : t('not_published')
            }
          </div>
        </div>

        <div className="announce-actions">
          <TooltipLink
            id={`${props.id}-show`}
            title={t('show')}
            className="btn-link-default"
            target={`#/${props.id}`}
          >
            <span className="fa fa-fw fa-expand" />
          </TooltipLink>

          <TooltipButton
            id={`${props.id}-send`}
            title={t('send_mail')}
            onClick={() => true}
            className="btn-link-default"
          >
            <span className="fa fa-fw fa-at" />
          </TooltipButton>

          <TooltipButton
            id={`${props.id}-edit`}
            title={t('edit')}
            onClick={() => true}
            className="btn-link-default"
          >
            <span className="fa fa-fw fa-pencil" />
          </TooltipButton>

          <TooltipButton
            id={`${props.id}-delete`}
            title={t('delete')}
            onClick={props.removePost}
            className="btn-link-danger"
          >
            <span className="fa fa-fw fa-trash-o" />
          </TooltipButton>
        </div>
      </div>

      <HtmlText>
        {props.content}
      </HtmlText>
    </div>
  </div>

AnnouncePost.propTypes = {
  id: T.string.isRequired,
  active: T.bool,
  title: T.string,
  content: T.string.isRequired,
  announcer: T.string,
  meta: T.shape({
    created: T.string.isRequired,
    creator: T.shape(UserTypes.propTypes).isRequired,
    publishedAt: T.string
  }).isRequired,
  restrictions: T.shape({
    visible: T.bool.isRequired
  }).isRequired,
  editPost: T.func.isRequired,
  removePost: T.func.isRequired,
  sendMail: T.func.isRequired
}

AnnouncePost.defaultProps = {
  active: false
}

const AnnouncesResource = props =>
  <div>
    <div className="announces-sort">
      Trier :
      <button type="button" className="btn btn-link">
        Des plus récentes aux plus anciennes
      </button>
    </div>

    {props.posts.map((post, index) =>
      <AnnouncePost
        {...post}

        key={post.id}
        editPost={props.editPost}
        removePost={() => props.removePost(post)}
        sendMail={() => props.sendMail(post)}
      />
    )}

    <nav className="text-right">
      <div className="pagination-condensed btn-group">
        <button type="button" className="btn btn-pagination btn-previous" disabled={true}>
          <span className="fa fa-angle-double-left" aria-hidden="true" />
          <span className="sr-only">Newer</span>
        </button>
        <button type="button" className="btn btn-pagination btn-next">
          Older
          <span className="fa fa-angle-double-right" aria-hidden="true" />
        </button>
      </div>
    </nav>
  </div>

AnnouncesResource.propTypes = {
  posts: T.arrayOf(T.shape({
    id: T.string.isRequired
  })).isRequired,
  createPost: T.func.isRequired,
  editPost: T.func.isRequired,
  removePost: T.func.isRequired,
  sendMail: T.func.isRequired
}

function mapStateToProps(state) {
  return {
    posts: select.posts(state)
  }
}

function mapDispatchToProps(dispatch) {
  return {
    createPost() {

    },
    editPost() {

    },
    removePost(announcePost) {
      dispatch(
        modalActions.showModal(MODAL_DELETE_CONFIRM, {
          title: t('remove_announce'),
          question: t('remove_announce_confirm'),
          handleConfirm: () => dispatch(actions.removeAnnounce(announcePost))
        })
      )
    },
    sendMail(announcePost) {
      // todo open UserPicker
      dispatch(
        modalActions.showModal(MODAL_CONFIRM, {
          title: t('send_announce'),
          question: t('send_announce_confirm'),
          handleConfirm: () => dispatch(actions.sendMail(announcePost))
        })
      )
    }
  }
}

const Announces = withRouter(connect(mapStateToProps, mapDispatchToProps)(AnnouncesResource))

export {
  Announces
}
