import React from 'react'
import {PropTypes as T} from 'prop-types'
import classes from 'classnames'
import get from 'lodash/get'

import {trans, transChoice} from '#/main/app/intl/translation'
import {asset} from '#/main/app/config/asset'
import {displayDate} from '#/main/app/intl/date'

import {DataCard} from '#/main/app/data/components/card'
import {UserMicro} from '#/main/core/user/components/micro'
import {ResourceNode as ResourceNodeTypes} from '#/main/core/resource/prop-types'
import {ResourceIcon} from '#/main/core/resource/components/icon'
import {getSimpleAccessRule} from '#/main/core/resource/permissions'
import {hasPermission} from '#/main/app/security'

// TODO : make footer generic

const ResourceCard = props => {
  // computes simplified version of node rights
  let rightsIcon, rightsTip
  if (props.data.rights && hasPermission('administrate', props.data)) {
    const rights = getSimpleAccessRule(props.data.rights, props.data.workspace)

    switch (rights) {
      case 'all':
        rightsIcon = 'fa-globe'
        rightsTip = 'resource_rights_all_tip'
        break
      case 'user':
        rightsIcon = 'fa-users'
        rightsTip = 'resource_rights_user_tip'
        break
      case 'workspace':
        rightsIcon = 'fa-book'
        rightsTip = 'resource_rights_workspace_tip'
        break
      case 'admin':
        rightsIcon = 'fa-lock'
        rightsTip = 'resource_rights_admin_tip'
        break
    }
  }

  return (
    <DataCard
      {...props}
      className={classes(props.className, {
        'data-card-muted': !get(props.data, 'meta.published', false) || get(props.data, 'restrictions.hidden', false)
      })}
      id={props.data.id}
      poster={props.data.thumbnail ? asset(props.data.thumbnail.url) : null}
      icon={
        <ResourceIcon className="icon" mimeType={props.data.meta.mimeType} />
      }
      title={props.data.name}
      subtitle={trans(props.data.meta.type, {}, 'resource')}
      flags={[
        props.data.rights && hasPermission('administrate', props.data) && [classes('fa fa-fw', rightsIcon), trans(rightsTip, {}, 'resource')],
        !props.data.meta.published && ['fa fa-fw fa-eye-slash', trans('resource_not_published', {}, 'resource')],
        props.data.meta.published && ['fa fa-fw fa-eye', transChoice('resource_views', props.data.meta.views, {count: props.data.meta.views}, 'resource'), props.data.meta.views],
        props.data.social && ['fa fa-fw fa-thumbs-up', transChoice('resource_likes', props.data.social.likes, {count: props.data.social.likes}, 'resource'), props.data.social.likes]
      ].filter(flag => !!flag)}
      contentText={props.data.meta.description}
      footer={
        <span
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <UserMicro {...props.data.meta.creator} />

          {trans('published_at', {date: displayDate(props.data.meta.created, false, true)})}
        </span>
      }
    />
  )
}

ResourceCard.propTypes = {
  className: T.string,
  data: T.shape(
    ResourceNodeTypes.propTypes
  ).isRequired
}

export {
  ResourceCard
}
