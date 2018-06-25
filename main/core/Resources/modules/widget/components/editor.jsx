import React from 'react'
import {PropTypes as T} from 'prop-types'
import sum from 'lodash/sum'
import times from 'lodash/times'

import {trans} from '#/main/core/translation'
import {toKey} from '#/main/core/scaffolding/text/utils'
import {Embedded} from '#/main/app/components/embedded'
import {Button} from '#/main/app/action/components/button'
import {EmptyPlaceholder} from '#/main/core/layout/components/placeholder'
import {Action as ActionTypes} from '#/main/app/action/prop-types'

import {
  WidgetContainer as WidgetContainerTypes,
  WidgetInstance as WidgetInstanceTypes
} from '#/main/core/widget/prop-types'
import {computeStyles} from '#/main/core/widget/utils'
import {getWidget} from '#/main/core/widget/types'
import {MODAL_WIDGET_CONTENT} from '#/main/core/widget/modals/content'


const WidgetCol = props =>
  <div className={`widget-col col-md-${props.size}`}>
    {props.content &&
      <Embedded
        name={`${props.content.type}-${props.content.id}`}
        load={getWidget(props.content.type)}
        parameters={[props.context, props.content.parameters]}
      />
    }

    {!props.content &&
      <Button
        className="btn btn-block btn-emphasis"
        type="modal"
        label={trans('add_content', {}, 'widget')}
        modal={[MODAL_WIDGET_CONTENT, {
          context: props.context
        }]}
      />
    }
  </div>

WidgetCol.propTypes = {
  size: T.number.isRequired,
  context: T.object,
  content: T.shape(
    WidgetInstanceTypes.propTypes
  )
}

const WidgetEditor = props =>
  <div className="widget-container">
    {props.actions.map(action =>
      <Button
        {...action}
        key={toKey(action.label)}
        id={`${toKey(action.label)}-${props.container.id}`}
        className="btn-link"
        tooltip="top"
      />
    )}

    <section className="widget" style={computeStyles(props.container)}>
      {props.container.name &&
        <h2 className="h-first widget-title">{props.container.name}</h2>
      }

      <div className="row">
        {times(props.container.display.layout.length, col =>
          <WidgetCol
            key={col}
            size={(12 / sum(props.container.display.layout)) * props.container.display.layout[col]}
            context={props.context}
            content={props.container.contents[col]}
          />
        )}
      </div>
    </section>
  </div>

WidgetEditor.propTypes = {
  context: T.object,
  container: T.shape(
    WidgetContainerTypes.propTypes
  ).isRequired,
  actions: T.arrayOf(T.shape(
    ActionTypes.propTypes
  )).isRequired
}

export {
  WidgetEditor
}
