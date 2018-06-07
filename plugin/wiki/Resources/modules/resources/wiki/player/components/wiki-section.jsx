import React from 'react'
import {PropTypes as T} from 'prop-types'
import {trans} from '#/main/core/translation'
import {Heading} from '#/main/core/layout/components/heading'
import {Button} from '#/main/app/action'

const WikiSection = props =>
  <div className="wiki-section">
    <Heading
      key={`wiki-section-title-${props.id}`}
      level={props.num.length + 3}
      className="wiki-section-title"
    >
      {props.title &&
        <span className="wiki-section-title-text">
          {props.displaySectionNumbers && props.num && Array.isArray(props.num) && <span className="ordering">{props.num.join('.')} - </span>}
          <span className="title">{props.title}</span>
        </span>
      }
      {props.loggedUserId !== null && (props.canEdit || props.mode !== '2') &&
        <span className="wiki-section-actions">
          {!props.visible &&
            <span className="wiki-section-invisible-text">
              ({trans(props.canEdit ? 'invisible' : 'waiting_for_moderation', {}, 'icap_wiki')})
            </span>
          }
          [
          <Button
            id={`wiki-section-add-${props.id}`}
            type="link"
            className="btn btn-link"
            target={`/add/${props.id}`}
            label={trans('add_new_subsection', {}, 'icap_wiki')}
          />
          |
          <Button
            id={`wiki-section-edit-${props.id}`}
            type="link"
            className="btn btn-link"
            target={`/edit/${props.id}`}
            label={trans('edit', {}, 'icap_wiki')}
          />
          |
          <Button
            id={`wiki-section-history-${props.id}`}
            type="link"
            className="btn btn-link"
            target={`/history/${props.id}`}
            label={trans('history', {}, 'icap_wiki')}
          />
          {props.loggedUserId !== null && props.canEdit && props.toggleVisibility !== null &&
            <span>
              |
              <Button
                id={`wiki-section-toggle-visibility-${props.id}`}
                type="callback"
                className="btn btn-link"
                label={trans(props.visible ? 'render_invisible' : 'render_visible', {}, 'icap_wiki')}
                callback={() => props.toggleVisibility(props.id, !props.visible)}
              />
            </span>
          }
          ]
        </span>
      }
    </Heading>
    <div className="wiki-section-content" dangerouslySetInnerHTML={{__html: props.text}}/>
    {
      props.sections &&
      props.sections.map(
        (section, index) =>
          <WikiSection
            id={section.id}
            key={section.id}
            num={props.num.push(index + 1)}
            title={section.activeContribution.title}
            text={section.activeContribution.text}
            displaySectionNumbers={props.displaySectionNumbers}
            sections={section.children}
            canEdit={props.canEdit}
            loggedUserId={props.loggedUserId}
            mode={props.mode}
            visible={section.meta.visible}
            toggleVisibility={props.toggleVisibility}
          />
      )
    }
  </div>

WikiSection.propTypes = {
  'id': T.string.isRequired,
  'title': T.string,
  'text': T.string.isRequired,
  'sections': T.arrayOf(T.object),
  'num': T.arrayOf(T.number).isRequired,
  'displaySectionNumbers': T.bool.isRequired,
  'canEdit': T.bool.isRequired,
  'loggedUserId': T.oneOfType([() => null, T.string]),
  'mode': T.string.isRequired,
  'visible': T.bool.isRequired,
  'toggleVisibility': T.oneOfType([() => null, T.string])
}

WikiSection.defaultProps = {
  'loggedUserId': null,
  'toggleVisibility': null,
  'title': null
}

export {
  WikiSection
}