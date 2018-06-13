import React from 'react'
import {implementPropTypes} from '#/main/core/scaffolding/prop-types'
import {trans} from '#/main/core/translation'
import {Heading} from '#/main/core/layout/components/heading'
import {Button} from '#/main/app/action'
import {Section as SectionTypes} from '#/plugin/wiki/resources/wiki/prop-types'
import {WikiSectionForm} from '#/plugin/wiki/resources/wiki/player/components/wiki-section-form'

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
        />
        <Button
          id={`wiki-section-edit-${props.section.id}`}
          type="callback"
          icon="fa fa-pencil"
          className="btn btn-link"
          tooltip="top"
          callback={() => props.currentSection(props.section.id)}
          label={trans('edit', {}, 'icap_wiki')}
          title={trans('edit', {}, 'icap_wiki')}
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
        {props.loggedUserId !== null && props.canEdit && props.toggleSectionVisibility !== null &&
        <Button
          id={`wiki-section-toggle-visibility-${props.section.id}`}
          type="callback"
          icon={props.section.meta.visible ? 'fa fa-eye' : 'fa fa-eye-slash'}
          className="btn btn-link"
          tooltip="top"
          label={trans(props.section.meta.visible ? 'render_invisible' : 'render_visible', {}, 'icap_wiki')}
          title={trans(props.section.meta.visible ? 'render_invisible' : 'render_visible', {}, 'icap_wiki')}
          callback={() => props.toggleSectionVisibility(props.section.id, !props.section.meta.visible)}
        />
        }
      </span>
      }
    </Heading>
    <div className="wiki-section-text" dangerouslySetInnerHTML={{__html: props.section.activeContribution.text}}/>
  </div>

implementPropTypes(WikiSectionContent, SectionTypes)

const WikiSection = props =>
  <div className="wiki-section">
    {(props.currentEditSection && props.currentEditSection.id && props.currentEditSection.id === props.section.id) ?
      <WikiSectionForm/> :
      <WikiSectionContent {...props}/>
    }
    {
      props.num.length > 0 &&
      props.section.children &&
      props.section.children.map(
        (section, index) =>
          <WikiSection
            id={section.id}
            key={section.id}
            num={props.num.concat([index + 1])}
            displaySectionNumbers={props.displaySectionNumbers}
            section={section}
            canEdit={props.canEdit}
            loggedUserId={props.loggedUserId}
            currentEditSection={props.currentEditSection}
            mode={props.mode}
            toggleSectionVisibility={props.toggleSectionVisibility}
            editSection={props.editSection}
            addSection={props.addSection}
          />
      )
    }
  </div>

implementPropTypes(WikiSection, SectionTypes)

export {
  WikiSection
}