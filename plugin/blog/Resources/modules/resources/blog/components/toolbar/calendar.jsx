import React from 'react'
import {connect} from 'react-redux'
import {PropTypes as T} from 'prop-types'
import Panel from 'react-bootstrap/lib/Panel'
import {t, trans} from '#/main/core/translation'
import {actions as listActions} from '#/main/core/data/list/actions'
import {actions} from '#/plugin/blog/resources/blog/actions.js'
import {Calendar} from '#/main/core/layout/calendar/components/calendar.jsx'
import {Section, Sections} from '#/main/core/layout/components/sections.jsx'
import moment from 'moment'
import {getApiFormat, now} from '#/main/core/scaffolding/date'

const BlogCalendarComponent = props =>
  <Panel header="Calendrier" className="calendar">
  <Calendar
    selected={props.calendarSelectedDate}
    onChange={props.searchByDate}
    time={false}
  />
  <Sections accordion>
    {props.archives && Object.keys(props.archives).reverse().map((year) =>(
      <Section id={year} level={2} title={year} key={year} className="archives-year">
        <ul>
          {props.archives[year] && Object.keys(props.archives[year]).map((month) =>(
            <li className="list-unstyled" key={month}>
              <a href="#" onClick={(e) => {
                props.searchByRange(props.archives[year][month]["monthValue"] - 1, year)
              }}>
                {props.archives[year][month]["month"]} ({props.archives[year][month]["count"]})
              </a>
            </li>
          ))}
        </ul>
      </Section>
    ))}
  </Sections>
  </Panel>
    
BlogCalendarComponent.propTypes = {
  calendarSelectedDate: T.string,
  archives: T.shape({}),
  searchByDate: T.func.isRequired,
  searchByRange: T.func.isRequired
}

const BlogCalendar = connect(
  state => ({
    calendarSelectedDate: state.calendarSelectedDate,
    archives: state.blog.data.archives
  }),
  dispatch => ({
    searchByDate: (date) => {
      dispatch(listActions.addFilter('posts', 'publicationDate', date));
      dispatch(actions.initDataList());
    },searchByRange: (month, year) => {
      let from = moment([year, month]);
      let format = getApiFormat();
      dispatch(listActions.addFilter('posts', 'fromDate', from.format(format)));
      dispatch(listActions.addFilter('posts', 'toDate', from.endOf('month').format(format)));
      dispatch(actions.initDataList());
    }
  })
)(BlogCalendarComponent)

export {BlogCalendar}