import React from 'react'
import {connect} from 'react-redux'
import {PropTypes as T} from 'prop-types'
import {actions as listActions} from '#/main/core/data/list/actions'
import {actions as postActions} from '#/plugin/blog/resources/blog/post/store'
import {Section, Sections} from '#/main/core/layout/components/sections.jsx'
import moment from 'moment'
import {getApiFormat} from '#/main/core/scaffolding/date'
import {trans} from '#/main/core/translation'

const ArchivesComponent = props =>
  <div key='redactors' className="panel panel-default">
    <div className="panel-heading">{trans('archives', {}, 'icap_blog')}</div>
    <div className="panel-body">
      <Sections accordion>
        {props.archives && Object.keys(props.archives).reverse().map((year) =>(
          <Section id={year} level={2} title={year} key={year} className="archives-year">
            <ul>
              {props.archives[year] && Object.keys(props.archives[year]).map((month) =>(
                <li className="list-unstyled" key={month}>
                  <a href="#" onClick={() => {
                    props.searchByRange(props.archives[year][month]['monthValue'] - 1, year)
                  }}>
                    {props.archives[year][month]['month']} ({props.archives[year][month]['count']})
                  </a>
                </li>
              ))}
            </ul>
          </Section>
        ))}
      </Sections>
    </div>
  </div>

ArchivesComponent.propTypes = {
  archives: T.shape({}),
  searchByRange: T.func.isRequired
}

const Archives = connect(
  state => ({
    archives: state.blog.data.archives
  }),
  dispatch => ({
    searchByRange: (month, year) => {
      let from = moment([year, month])
      let format = getApiFormat()
      dispatch(listActions.addFilter('posts', 'fromDate', from.format(format)))
      dispatch(listActions.addFilter('posts', 'toDate', from.endOf('month').format(format)))
      dispatch(postActions.initDataList())
    }
  })
)(ArchivesComponent)

export {Archives}