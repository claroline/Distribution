import React from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'
import classes from 'classnames'

import {asset} from '#/main/core/asset'
import {t} from '#/main/core/translation'
import {actions as modalActions} from '#/main/core/layout/modal/actions'

const AudioThumbnail = props =>
  <div className="audio-file-thumbnail">
    {props.data &&
      <audio
        onClick={e => e.stopPropagation()}
        controls
      >
        <source src={asset(props.data)} type={props.type}/>
      </audio>
    }
  </div>

AudioThumbnail.propTypes = {
  data: T.object,
  type: T.string.isRequired
}

const VideoThumbnail = props =>
  <div className="video-file-thumbnail">
    {props.data &&
      <video
        className="not-video-js vjs-big-play-centered vjs-default-skin vjs-16-9"
        onClick={e => e.stopPropagation()}
        controls
      >
        <source src={asset(props.data)} type={props.type}/>
      </video>
    }
  </div>

VideoThumbnail.propTypes = {
  data: T.object,
  type: T.string.isRequired
}

const ImageThumbnail = props =>
  <div className="image-file-thumbnail">
    {props.data &&
      <img src={asset(props.data)}/>
    }
  </div>

ImageThumbnail.propTypes = {
  data: T.object,
  type: T.string.isRequired
}

const DefaultThumbnail = props =>
  <div className="default-file-thumbnail">
    <span className="file-thumbnail-icon fa fa-w fa-file-o"/>
    {props.data && props.data.name &&
      <div className="file-thumbnail-name text-center">{props.data.name}</div>
    }
  </div>

DefaultThumbnail.propTypes = {
  data: T.object,
  type: T.string.isRequired
}

const FileThumbnailContent = props => {
  switch (props.type) {
    case 'image':
      return (<ImageThumbnail {...props}/>)
    case 'audio':
      return (<AudioThumbnail {...props}/>)
    case 'video':
      return (<VideoThumbnail {...props}/>)
    default:
      return (<DefaultThumbnail {...props}/>)
  }
}

FileThumbnailContent.propTypes = {
  data: T.object,
  type: T.string.isRequired
}

const Actions = props =>
  <span className="file-thumbnail-actions">
    {props.hasExpandBtn &&
      <span
        role="button"
        title={t('watch_at_the_original_size')}
        className="action-button fa fa-external-link"
        onClick={e => {
          e.stopPropagation()
          props.handleExpand(e)
        }}
      />
    }
    {props.hasEditBtn &&
      <span
        role="button"
        title={t('edit')}
        className="action-button fa fa-pencil"
        onClick={e => props.handleEdit(e)}
      />
    }
    {props.hasDeleteBtn &&
      <span
        role="button"
        title={t('delete')}
        className="action-button fa fa-trash-o"
        onClick={e => props.handleDelete(e)}
      />
    }
  </span>

Actions.propTypes = {
  hasDeleteBtn: T.bool,
  hasEditBtn: T.bool,
  hasExpandBtn: T.bool,
  handleEdit: T.func,
  handleDelete: T.func,
  handleExpand: T.func
}

const FileThumbnail = props =>
  <span
    className="file-thumbnail"
    onClick={() => {}}
  >
    <span className="file-thumbnail-topbar">
      <Actions
        hasDeleteBtn={props.canDelete}
        hasEditBtn={props.canEdit}
        hasExpandBtn={props.canExpand}
        handleEdit={props.handleEdit}
        handleDelete={props.handleDelete}
        handleExpand={props.expand}
        {...props}
      />
    </span>
    <span className="file-thumbnail-content">
      <FileThumbnailContent
        type={props.type}
        data={props.data}
      />
    </span>
  </span>

FileThumbnail.propTypes = {
  data: T.object,
  type: T.string.isRequired,
  canEdit: T.bool.isRequired,
  canDelete: T.bool.isRequired,
  canExpand: T.bool.isRequired,
  handleEdit: T.func.isRequired,
  handleDelete: T.func.isRequired,
  handleExpand: T.func.isRequired,
  showModal: T.func.isRequired
}

FileThumbnail.defaultProps = {
  type: 'file',
  canEdit: true,
  canDelete: true,
  canExpand: true,
  handleEdit: () => {},
  handleDelete: () => {},
  handleExpand: () => {}
}

function mapDispatchToProps(dispatch) {
  return {
    showModal: (type, props) => dispatch(modalActions.showModal(type, props))
  }
}

const ConnectedFileThumbnail = connect(null, mapDispatchToProps)(FileThumbnail)

export {ConnectedFileThumbnail as FileThumbnail}
