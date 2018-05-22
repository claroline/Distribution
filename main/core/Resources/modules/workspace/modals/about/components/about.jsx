import React from 'react'
import {PropTypes as T} from 'prop-types'
import omit from 'lodash/omit'

import {url} from '#/main/app/api'
import {trans} from '#/main/core/translation'
import {copy} from '#/main/app/clipboard'
import {Button} from '#/main/app/action/components/button'
import {Modal} from '#/main/app/overlay/modal/components/modal'
import {DataDetails} from '#/main/core/data/details/components/details'
import {UserMicro} from '#/main/core/user/components/micro'

import {WorkspaceMetrics} from '#/main/core/workspace/components/metrics'
import {Workspace as WorkspaceTypes} from '#/main/core/workspace/prop-types'

const AboutModal = props =>
  <Modal
    {...omit(props, 'workspace')}
    icon="fa fa-fw fa-info"
    title={props.workspace.name}
    subtitle={props.workspace.code}
  >
    <div className="modal-link">
      <Button
        type="url"
        label={url(['claro_workspace_subscription_url_generate', {slug: props.workspace.meta.slug}, true])}
        className="btn-link"
        target={url(['claro_workspace_subscription_url_generate', {slug: props.workspace.meta.slug}, true])}
      />

      <Button
        id={`clipboard-${props.workspace.id}`}
        type="callback"
        tooltip="left"
        label={trans('clipboard_copy')}
        className="btn-link"
        icon="fa fa-fw fa-clipboard"
        callback={() => copy(url(['claro_workspace_subscription_url_generate', {slug: props.workspace.meta.slug}, true]))}
      />
    </div>

    <div className="modal-body">
      <WorkspaceMetrics
        workspace={props.workspace}
        level={5}
        width={80}
        height={80}
      />
    </div>

    {props.workspace.meta.description &&
      <div className="modal-body text-justify" style={{fontStyle: 'italic'}}>
        {props.workspace.meta.description}
      </div>
    }

    <DataDetails
      data={props.workspace}
      sections={[
        {
          title: trans('general'),
          primary: true,
          fields: [
            {
              name: 'meta.model',
              label: 'Cet espace d\'activités n\'est pas un modèle.',
              type: 'boolean',
              options: {
                icon: 'fa fa-fw fa-object-group',
                labelChecked: 'Cette espace d\'activités est un modèle.',
              }
            }, {
              name: 'meta.personal',
              label: 'Cet espace d\'activités n\'est pas un espace personnel.',
              type: 'boolean',
              options: {
                icon: 'fa fa-fw fa-user',
                labelChecked: 'Cet espace d\'activités est un espace personnel.',
              }
            }, {
              name: 'registration.selfRegistration',
              label: 'Les inscriptions sont gérées par les gestionnaires.',
              type: 'boolean',
              options: {
                icon: 'fa fa-fw fa-user-plus',
                labelChecked: 'Les inscriptions sont publiques.',
              }
            }, {
              name: 'registration.selfUnregistration',
              label: 'Les désinscriptions sont gérées par les gestionnaires.',
              type: 'boolean',
              options: {
                icon: 'fa fa-fw fa-user-times',
                labelChecked: 'Les désinscriptions sont publiques.',
              }
            }
          ]
        }
      ]}
    />

    <div className="modal-footer">
      <UserMicro
        {...props.workspace.meta.creator}
      />
    </div>
  </Modal>

AboutModal.propTypes = {
  workspace: T.shape(
    WorkspaceTypes.propTypes
  ).isRequired
}

export {
  AboutModal
}
