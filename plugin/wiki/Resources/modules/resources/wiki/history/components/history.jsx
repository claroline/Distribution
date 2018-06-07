import React from 'react'
import {PropTypes as T} from 'prop-types'
import {trans} from '#/main/core/translation'
import {DataListContainer} from '#/main/core/data/list/containers/data-list'

const History = props =>
  <section className="resource-section">
    <h2>{props.sectionTitle}</h2>
    <DataListContainer
      name="history"
      fetch={{
        url: ['apiv2_wiki_section_contribution_history', {sectionId: props.sectionId}],
        autoload: true
      }}
      definition={[
        {
          name: 'meta.createdAt',
          label: trans('date', {}, 'platform'),
          type: 'date',
          displayed: true,
          filterable: true,
          options: {
            time: true
          }
        }, {
          name: 'meta.creator',
          label: trans('user', {}, 'platform'),
          type: 'string',
          displayed: true,
          renderer: (rowData) => rowData.meta.creator ? `${rowData.meta.creator.firstName} ${rowData.meta.creator.lastName}` : trans('unknown')
        }
      ]}
      actions={() => [
      
      ]}
    />
  </section>

History.propTypes = {
  section: T.object.isRequired
}

export {
  History
}