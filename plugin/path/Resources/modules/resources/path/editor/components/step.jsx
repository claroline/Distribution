import React, {Fragment} from 'react'

import {trans, transChoice} from '#/main/app/intl/translation'
import {PropTypes as T, implementPropTypes} from '#/main/app/prop-types'
import {Action as ActionTypes} from '#/main/app/action/prop-types'
import {Toolbar} from '#/main/app/action/components/toolbar'
import {Button} from '#/main/app/action/components/button'
import {CALLBACK_BUTTON, LINK_BUTTON, MODAL_BUTTON} from '#/main/app/buttons'

import {FormData} from '#/main/app/content/form/containers/data'
import {FormSections, FormSection} from '#/main/app/content/form/components/sections'
import {MODAL_RESOURCE_EXPLORER} from '#/main/core/modals/resources'
import {ResourceCard} from '#/main/core/resource/components/card'
import {ResourceNode as ResourceNodeTypes} from '#/main/core/resource/prop-types'

import {Step as StepTypes} from '#/plugin/path/resources/path/prop-types'
import {selectors} from '#/plugin/path/resources/path/editor/store'

const SecondaryResourcesSection = props =>
  <Fragment>
    {props.secondaryResources && props.secondaryResources.map(sr =>
      <ResourceCard
        className="step-secondary-resources"
        key={`secondary-resource-${sr.id}`}
        data={sr.resource}
        actions={[
          {
            name: 'delete',
            type: CALLBACK_BUTTON,
            icon: 'fa fa-fw fa-trash-o',
            label: trans('delete', {}, 'actions'),
            dangerous: true,
            callback: () => props.removeSecondaryResource(props.stepId, sr.id),
            confirm: {
              title: transChoice('resources_delete_confirm', 1),
              message: transChoice('resources_delete_message', 1, {count: 1})
            }
          }
        ]}
      />
    )}

    <Button
      type={MODAL_BUTTON}
      className="btn btn-block"
      icon="fa fa-fw fa-plus"
      label={trans('add_resources')}
      modal={[MODAL_RESOURCE_EXPLORER, {
        title: trans('add_secondary_resources', {}, 'path'),
        current: props.parent,
        selectAction: (selected) => ({
          type: CALLBACK_BUTTON,
          label: trans('select', {}, 'actions'),
          callback: (selected) => props.pickSecondaryResources(props.stepId, selected)
        })
      }]}
    />
  </Fragment>

SecondaryResourcesSection.propTypes = {
  stepId: T.string.isRequired,
  parent: T.shape(
    ResourceNodeTypes.propTypes
  ),
  secondaryResources: T.array,
  pickSecondaryResources: T.func.isRequired,
  removeSecondaryResource: T.func.isRequired,
  updateSecondaryResourceInheritance: T.func.isRequired
}

const InheritedResourcesSection = props =>
  <Fragment>
    {props.inheritedResources && props.inheritedResources.map(ir =>
      <div key={`inherited-resource-${ir.id}`}>
        {ir.resource.name} [{trans(ir.resource.meta.type, {}, 'resource')}]
        <span
          className="fa fa-fw fa-trash-o pointer-hand"
          onClick={() => props.removeInheritedResource(props.stepId, ir.id)}
        />
      </div>
    )}
  </Fragment>

InheritedResourcesSection.propTypes = {
  stepId: T.string.isRequired,
  inheritedResources: T.array,
  removeInheritedResource: T.func.isRequired
}

const EditorStep = props =>
  <Fragment>
    <h3 className="h2 step-title">
      {props.numbering &&
        <span className="h-numbering">{props.numbering}</span>
      }

      {props.title}

      <Toolbar
        id={props.id}
        className="step-toolbar"
        buttonName="btn"
        tooltip="bottom"
        toolbar="more"
        size="sm"
        actions={props.actions}
      />
    </h3>

    <FormData
      level={3}
      displayLevel={2}
      name={selectors.FORM_NAME}
      dataPart={props.stepPath}
      target={['apiv2_path_update', {id: props.pathId}]}
      buttons={true}
      cancel={{
        type: LINK_BUTTON,
        target: '/',
        exact: true
      }}
      sections={[
        {
          title: trans('general'),
          primary: true,
          fields: [
            {
              name: 'description',
              type: 'html',
              label: trans('content'),
              options: {
                workspace: props.workspace
              }
            }
          ]
        }, {
          title: trans('information'),
          icon: 'fa fa-fw fa-info',
          fields: [
            {
              name: 'title',
              type: 'string',
              label: trans('title'),
              required: true
            }
          ]
        }, {
          icon: 'fa fa-fw fa-desktop',
          title: trans('display_parameters'),
          fields: [
            {
              name: 'poster',
              type: 'image',
              label: trans('poster'),
              options: {
                ratio: '3:1'
              }
            }, {
              name: 'display.numbering',
              type: 'string',
              label: trans('step_numbering', {}, 'path'),
              displayed: props.customNumbering
            }, {
              name: 'display.height',
              type: 'number',
              label: trans('step_content_height', {}, 'path'),
              options: {
                min: 0,
                unit: 'px',
                help: trans('step_content_height_info', {}, 'path')
              }
            }
          ]
        }, {
          icon: 'fa fa-fw fa-folder-open-o',
          title: trans('primary_resource', {}, 'path'),
          fields: [
            {
              name: 'primaryResource',
              type: 'resource',
              label: trans('resource'),
              options: {
                embedded: true,
                showHeader: true,
                picker: {
                  current : props.resourceParent
                },
                onEmbeddedResourceClose: props.onEmbeddedResourceClose
              }
            }, {
              name: 'showResourceHeader',
              type: 'boolean',
              label: trans('show_resource_header')
            }
          ]
        }
      ]}
    >
      <FormSections level={3}>
        <FormSection
          className="embedded-list-section"
          icon="fa fa-fw fa-folder"
          title={trans('secondary_resources', {}, 'path')}
        >
          <SecondaryResourcesSection
            stepId={props.id}
            parent={props.resourceParent}
            secondaryResources={props.secondaryResources}
            pickSecondaryResources={props.pickSecondaryResources}
            removeSecondaryResource={props.removeSecondaryResource}
            updateSecondaryResourceInheritance={props.updateSecondaryResourceInheritance}
          />
        </FormSection>

        {props.inheritedResources.length > 0 &&
          <FormSection
            className="embedded-list-section"
            icon="fa fa-fw fa-folder-o"
            title={trans('inherited_resources', {}, 'path')}
          >
            <InheritedResourcesSection
              stepId={props.id}
              inheritedResources={props.inheritedResources}
              removeInheritedResource={props.removeInheritedResource}
            />
          </FormSection>
        }
      </FormSections>
    </FormData>
  </Fragment>

implementPropTypes(EditorStep, StepTypes, {
  pathId: T.string.isRequired,
  workspace: T.object,
  resourceParent: T.shape(
    ResourceNodeTypes.propTypes
  ),
  stepPath: T.string.isRequired,
  actions: T.arrayOf(T.shape(
    ActionTypes.propTypes
  )),
  numbering: T.string,
  customNumbering: T.bool,
  pickSecondaryResources: T.func.isRequired,
  removeSecondaryResource: T.func.isRequired,
  updateSecondaryResourceInheritance: T.func.isRequired,
  removeInheritedResource: T.func.isRequired,
  onEmbeddedResourceClose: T.func
}, {
  customNumbering: false
})


export {
  EditorStep
}
