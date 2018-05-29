import React from 'react'
import {PropTypes as T} from 'prop-types'
import omit from 'lodash/omit'

import {trans} from '#/main/core/translation'
import {Modal} from '#/main/app/overlay/modal/components/modal'
import {DataDetails} from '#/main/core/data/details/components/details'
import {ContentMeta} from '#/main/app/content/meta/components/meta'
import {ContentPublicUrl} from '#/main/app/content/meta/components/public-url'

import {ResourceNode as ResourceNodeTypes} from '#/main/core/resource/prop-types'

// todo implement

const AboutModal = props =>
  <Modal
    {...omit(props, 'workspace')}
    icon="fa fa-fw fa-info"
    title={trans('about')}
    subtitle={props.resourceNode.name}
  >
    <ContentPublicUrl
      className="modal-link"
      url={['claro_resource_action', {
        resourceType: props.resourceNode.meta.type,
        action: 'open', // todo : get default from resource action list
        id: props.resourceNode.id
      }, true]}
    />

    <div className="modal-body">
      TODO some metrics about the resource ?
    </div>

    <DataDetails
      data={props.workspace}
      sections={[
        {
          title: trans('general'),
          primary: true,
          fields: [
            {
              name: 'meta.description',
              label: trans('description'),
              type: 'string'
            }, {
              name: 'code',
              label: trans('code'),
              type: 'string'
            }, {
              name: 'meta.model',
              label: 'Cet espace d\'activités n\'est pas un modèle.',
              type: 'boolean',
              options: {
                icon: 'fa fa-fw fa-object-group',
                labelChecked: 'Cette espace d\'activités est un modèle.'
              }
            }, {
              name: 'meta.personal',
              label: 'Cet espace d\'activités n\'est pas un espace personnel.',
              type: 'boolean',
              options: {
                icon: 'fa fa-fw fa-user',
                labelChecked: 'Cet espace d\'activités est un espace personnel.'
              }
            }, {
              name: 'registration.selfRegistration',
              label: 'Les inscriptions sont gérées par les gestionnaires.',
              type: 'boolean',
              options: {
                icon: 'fa fa-fw fa-user-plus',
                labelChecked: 'Les inscriptions sont publiques.'
              }
            }, {
              name: 'registration.selfUnregistration',
              label: 'Les désinscriptions sont gérées par les gestionnaires.',
              type: 'boolean',
              options: {
                icon: 'fa fa-fw fa-user-times',
                labelChecked: 'Les désinscriptions sont publiques.'
              }
            }
          ]
        }
      ]}
    />

    <div className="modal-footer">
      <ContentMeta
        meta={props.resourceNode.meta}
      />
    </div>
  </Modal>

AboutModal.propTypes = {
  resourceNode: T.shape(
    ResourceNodeTypes.propTypes
  ).isRequired
}

export {
  AboutModal
}
