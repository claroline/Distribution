import React from 'react'
import {connect} from 'react-redux'

import {t, trans, transChoice} from '#/main/core/translation'
import {generateUrl} from '#/main/core/fos-js-router'

import {localeDate} from '#/main/core/layout/data/types/date/utils'

import {
  PageContainer as Page,
  PageHeader,
  PageContent
} from '#/main/core/layout/page'

import {DataListContainer as DataList} from '#/main/core/layout/list/containers/data-list.jsx'

const PortalPage = () =>
  <Page id="portal">
    <PageHeader title={t('portal')}>
    </PageHeader>

    <PageContent>
      <DataList
        name="portal"
        definition={[
          {
            name: 'name',
            label: t('name'),
            renderer: (rowData) => {
              // variables is used because React will use it has component display name (eslint requirement)
              const wsLink = <a href={generateUrl('claro_resource_open', {node: rowData.id, resourceType: rowData.meta.type})}>{rowData.name}</a>

              return wsLink
            },
            displayed: true
          }, {
            name: 'meta.created',
            label: t('creation_date'),
            type: 'date',
            alias: 'creationDate',
            displayed: true,
            filterable: false
          }, {
            name: 'createdAfter',
            label: t('created_after'),
            type: 'date',
            displayable: false
          }, {
            name: 'createdBefore',
            label: t('created_before'),
            type: 'date',
            displayable: false
          }
        ]}

        card={(row) => ({
          onClick: generateUrl('claro_resource_open', {node: row.id, resourceType: row.meta.type}),
          poster: row.poster,
          icon: <span className="item-icon-container" style={{
            backgroundImage: 'url("/data/icon_sets/claroline/' + row.meta.type + '.svg")',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}></span>,
          title: row.name,
          subtitle: row.code,
          contentText: row.meta.description,
          flags: [
            row.meta.views   && ['fa fa-eye', transChoice('display_views', row.meta.views, {'%count%': row.meta.views}, 'platform')],
            row.social.likes && ['fa fa-heart', transChoice('nb_likes', row.social.likes, {'%count%': row.social.likes}, 'icap_socialmedia')]
          ].filter(flag => !!flag),
          footer:
            <span>
              {t('published_at')} <b>{localeDate(row.meta.created)}</b>
            </span>,
          footerLong:
            <span>
              <b>{trans(row.meta.type, {}, 'resource')}</b> {t('published_at')} {localeDate(row.meta.created)}
              <span className="creator"> {t('by')} {row.meta.creator ? row.meta.creator.name: t('unknown')}</span><br />
            </span>
        })}
      />
    </PageContent>
  </Page>

const Portal = connect(null, null)(PortalPage)

export {
  Portal
}