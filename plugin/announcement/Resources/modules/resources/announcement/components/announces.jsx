import React from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'
import classes from 'classnames'

import {t, trans} from '#/main/core/translation'
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
          {props.meta.author ?
            <UserMicro name={props.meta.author} /> :
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
            onClick={props.sendMail}
            className="btn-link-default"
          >
            <span className="fa fa-fw fa-at" />
          </TooltipButton>

          <TooltipLink
            id={`${props.id}-edit`}
            title={t('edit')}
            target={`#/${props.id}/edit`}
            className="btn-link-default"
          >
            <span className="fa fa-fw fa-pencil" />
          </TooltipLink>

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
  meta: T.shape({
    created: T.string.isRequired,
    creator: T.shape(UserTypes.propTypes).isRequired,
    author: T.string,
    publishedAt: T.string
  }).isRequired,
  restrictions: T.shape({
    visible: T.bool.isRequired
  }).isRequired,
  removePost: T.func.isRequired,
  sendMail: T.func.isRequired
}

AnnouncePost.defaultProps = {
  active: false
}

const AnnouncesResource = props =>
  <div>
    <div className="announces-sort">
      {t('list_sort_by')}
      <button
        type="button"
        className="btn btn-link"
        onClick={props.toggleSort}
      >
        {trans(1 === props.sortOrder ? 'from_older_to_newer':'from_newer_to_older', {}, 'announcement')}
      </button>
    </div>

    {props.posts.map((post, index) =>
      <AnnouncePost
        {...post}

        key={post.id}
        removePost={() => props.removePost(post)}
        sendMail={() => props.sendMail(post)}
      />
    )}

    {1 !== props.pages &&
      <nav className="text-right">
        <div className="pagination-condensed btn-group">
          <button
            type="button"
            className="btn btn-pagination btn-previous"
            disabled={0 === props.currentPage}
            onClick={() => props.changePage(props.currentPage - 1)}
          >
            <span className="fa fa-angle-double-left" aria-hidden="true" />
            <span className="sr-only">
              {trans(1 === props.sortOrder ? 'older':'newer', {}, 'announcement')}
            </span>
          </button>

          <button
            type="button"
            className="btn btn-pagination btn-next"
            disabled={(props.pages - 1) === props.currentPage}
            onClick={() => props.changePage(props.currentPage + 1)}
          >
            {trans(1 === props.sortOrder ? 'newer':'older', {}, 'announcement')}
            <span className="fa fa-angle-double-right" aria-hidden="true" />
          </button>
        </div>
      </nav>
    }
  </div>

AnnouncesResource.propTypes = {
  sortOrder: T.number.isRequired,
  currentPage: T.number.isRequired,
  pages: T.number.isRequired,
  posts: T.arrayOf(T.shape({
    id: T.string.isRequired
  })).isRequired,
  toggleSort: T.func.isRequired,
  changePage: T.func.isRequired,
  removePost: T.func.isRequired,
  sendMail: T.func.isRequired
}

function mapStateToProps(state) {
  return {
    sortOrder: select.sortOrder(state),
    currentPage: select.currentPage(state),
    pages: select.pages(state),
    posts: select.visibleSortedPosts(state)
  }
}

function mapDispatchToProps(dispatch) {
  return {
    removePost(announcePost) {
      dispatch(
        modalActions.showModal(MODAL_DELETE_CONFIRM, {
          title: trans('remove_announce', {}, 'announcement'),
          question: trans('remove_announce_confirm', {}, 'announcement'),
          handleConfirm: () => dispatch(actions.removeAnnounce(announcePost))
        })
      )
    },
    sendMail(announcePost) {
      // todo open UserPicker
      dispatch(
        modalActions.showModal(MODAL_CONFIRM, {
          title: trans('send_announce', {}, 'announcement'),
          question: trans('send_announce_confirm', {}, 'announcement'),
          handleConfirm: () => dispatch(actions.sendMail(announcePost))
        })
      )
    },
    toggleSort() {
      dispatch(actions.toggleAnnouncesSort())
    },
    changePage(page) {
      dispatch(actions.changeAnnouncesPage(page))
    }
  }
}

const Announces = connect(mapStateToProps, mapDispatchToProps)(AnnouncesResource)

export {
  Announces
}
