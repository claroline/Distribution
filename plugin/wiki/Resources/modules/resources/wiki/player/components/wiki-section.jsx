import React from 'react'
import {connect} from 'react-redux'
import {trans} from '#/main/core/translation'
import {hasPermission} from '#/main/core/resource/permissions'
import {currentUser} from '#/main/core/user/current'
import {implementPropTypes} from '#/main/core/scaffolding/prop-types'
import {selectors as resourceSelect} from '#/main/core/resource/store'
import {select as formSelect} from '#/main/core/data/form/selectors'
import {Heading} from '#/main/core/layout/components/heading'
import {Button} from '#/main/app/action'
import {Section as SectionTypes} from '#/plugin/wiki/resources/wiki/prop-types'
import {WikiSectionForm} from '#/plugin/wiki/resources/wiki/player/components/wiki-section-form'
import {actions as formActions} from '#/main/core/data/form/actions'
import {actions} from '#/plugin/wiki/resources/wiki/player/store'

const loggedUser = currentUser()

const WikiSectionContent = props =>
  <div className="wiki-section-content">
    <Heading
      key={`wiki-section-title-${props.section.id}`}
      level={props.num.length + 3}
      className="wiki-section-title"
    >
      {props.section.activeContribution.title &&
      <span className="wiki-section-title-text">
        {props.displaySectionNumbers && props.num && Array.isArray(props.num) && <span className="ordering">{props.num.join('.')} - </span>}
        <span className="title">{props.section.activeContribution.title}</span>
      </span>
      }
      {props.loggedUserId !== null && (props.canEdit || props.mode !== '2') &&
      <span className="wiki-section-actions">
        {!props.section.meta.visible &&
        <span className="wiki-section-invisible-text">
          ({trans(props.canEdit ? 'invisible' : 'waiting_for_moderation', {}, 'icap_wiki')})
        </span>
        }
        <Button
          id={`wiki-section-add-${props.section.id}`}
          type="callback"
          icon="fa fa-plus"
          className="btn btn-link"
          tooltip="top"
          callback={() => props.addSection(props.section.id)}
          label={trans('add_new_subsection', {}, 'icap_wiki')}
          title={trans('add_new_subsection', {}, 'icap_wiki')}
          confirm={!props.saveEnabled ? undefined : {
            message: trans('unsaved_changes_warning'),
            button: trans('proceed')
          }}
        />
        <Button
          id={`wiki-section-edit-${props.section.id}`}
          type="callback"
          icon="fa fa-pencil"
          className="btn btn-link"
          tooltip="top"
          callback={() => props.editSection(props.section)}
          label={trans('edit', {}, 'icap_wiki')}
          title={trans('edit', {}, 'icap_wiki')}
          confirm={!props.saveEnabled ? undefined : {
            message: trans('unsaved_changes_warning'),
            button: trans('proceed')
          }}
        />
        <Button
          id={`wiki-section-history-${props.section.id}`}
          type="link"
          icon="fa fa-clock-o"
          className="btn btn-link"
          tooltip="top"
          target={`/history/${props.section.id}`}
          label={trans('history', {}, 'icap_wiki')}
          title={trans('history', {}, 'icap_wiki')}
        />
        {props.loggedUserId !== null && props.canEdit && props.setSectionVisibility &&
        <Button
          id={`wiki-section-toggle-visibility-${props.section.id}`}
          type="callback"
          icon={props.section.meta.visible ? 'fa fa-eye' : 'fa fa-eye-slash'}
          className="btn btn-link"
          tooltip="top"
          label={trans(props.section.meta.visible ? 'render_invisible' : 'render_visible', {}, 'icap_wiki')}
          title={trans(props.section.meta.visible ? 'render_invisible' : 'render_visible', {}, 'icap_wiki')}
          callback={() => props.setSectionVisibility(props.section.id, !props.section.meta.visible)}
        />
        }
        {props.num.length > 0 && props.loggedUserId !== null && (props.canEdit || props.loggedUserId === props.section.meta.creator.id) &&
        <Button
          id={`wiki-section-delete-${props.section.id}`}
          type="callback"
          icon="fa fa-trash-o"
          className="btn btn-link"
          dangerous={true}
          tooltip="top"
          label={trans('delete')}
          title={trans('delete')}
          callback={deleteChildren => props.deleteSection(props.section.id, deleteChildren)}
          confirm={{
            message: trans('confirm_delete'),
            button: trans('proceed')
          }}
        />
        }
      </span>
      }
    </Heading>
    <div className="wiki-section-text" dangerouslySetInnerHTML={{__html: props.section.activeContribution.text}}/>
  </div>

implementPropTypes(WikiSectionContent, SectionTypes)

const WikiSectionComponent = props =>
  <div className="wiki-section">
    {(props.currentSection && props.currentSection.id && props.currentSection.id === props.section.id) ?
      <WikiSectionForm
        isNew={props.isNew}
        cancelChanges={props.editSection}
        saveChanges={() => props.saveSection(props.section.id, props.isNew)}
      /> :
      <WikiSectionContent {...props}/>
    }
    {(props.currentSection && props.currentSection.parentId && props.currentSection.parentId === props.section.id) &&
    <WikiSectionForm
      isNew={props.isNew}
      cancelChanges={props.addSection}
      saveChanges={() => props.saveSection(props.section.id, props.isNew)}
    />
    }
    {
      props.num.length > 0 &&
      props.section.children &&
      props.section.children.map(
        (section, index) =>
          <WikiSectionComponent
            key={section.id}
            num={props.num.concat([index + 1])}
            displaySectionNumbers={props.displaySectionNumbers}
            section={section}
            canEdit={props.canEdit}
            loggedUserId={props.loggedUserId}
            currentSection={props.currentSection}
            mode={props.mode}
            setSectionVisibility={props.setSectionVisibility}
            editSection={props.editSection}
            addSection={props.addSection}
            deleteSection={props.deleteSection}
            isNew={props.isNew}
            saveEnabled={props.saveEnabled}
          />
      )
    }
  </div>

implementPropTypes(WikiSectionComponent, SectionTypes)

const WikiSection = connect(
  (state, props = {}) => ({
    displaySectionNumbers: props.displaySectionNumbers ? props.displaySectionNumbers : state.wiki.display.sectionNumbers,
    mode: state.wiki.mode,
    currentSection: state.sections.currentSection,
    canEdit: hasPermission('edit', resourceSelect.resourceNode(state)),
    loggedUserId: loggedUser === null ? null : loggedUser.id,
    isNew: formSelect.isNew(formSelect.form(state, 'sections.currentSection')),
    saveEnabled: formSelect.saveEnabled(formSelect.form(state, 'sections.currentSection'))
  }),
  (dispatch, props = {}) => (
    {
      setSectionVisibility: props.setSectionVisibility === null ? null : (sectionId, visible) => dispatch(actions.setSectionVisibility(sectionId, visible)),
      addSection: (parentId = null) => dispatch(actions.setCurrentParentSection(parentId)),
      editSection: (section = null) => dispatch(actions.setCurrentEditSection(section)),
      deleteSection: (sectionId, deleteChildren) => dispatch(actions.deleteSection(sectionId, deleteChildren)),
      saveSection: (id, isNew) => dispatch(formActions.saveForm('sections.currentSection', [isNew ? 'apiv2_wiki_section_create' : 'apiv2_wiki_section_update', {id}]))
    }
  )
)(WikiSectionComponent)

export {
  WikiSection
}