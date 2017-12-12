import React, {Component} from 'react'
import classes from 'classnames'

import {PropTypes as T, implementPropTypes} from '#/main/core/prop-types'
import {Page as PageTypes} from '#/main/core/layout/page/prop-types'

import {Router, Route, Redirect, NavLink, Switch} from '#/main/core/router'
import {Page, PageContent} from '#/main/core/layout/page/components/page.jsx'
import {PageActions, PageAction} from '#/main/core/layout/page/components/page-actions.jsx'

// todo : use PageTab component

const PageTabs = props =>
  <header className={classes('page-header', props.className)}>
    <nav className="page-tabs">
      {props.sections.map((section, sectionIndex) =>
        <NavLink
          key={`section-link-${sectionIndex}`}
          to={section.path}
          exact={section.exact}
        >
          <span className={classes('page-tabs-icon', section.icon)} />
          {section.title}
        </NavLink>
      )}
    </nav>

    {props.children}
  </header>

PageTabs.propTypes = {
  className: T.string,
  sections: T.arrayOf(T.shape({
    path: T.string.isRequired,
    exact: T.bool,
    icon: T.string.isRequired,
    title: T.string.isRequired
  })).isRequired,
  children: T.node,
}

const PageTab = props =>
  <div className="page-content page-tab">
    <h1 className="sr-only">{props.title}</h1>

    {props.children}
  </div>

PageTab.propTypes = {
  path: T.string.isRequired,
  icon: T.string.isRequired,
  exact: T.bool,
  children: T.any.isRequired
}

PageTab.defaultProps = {
  exact: false,
  actions: []
}

// todo add H1 (page title) and H2 (current tab title)

const TabbedPage = props =>
  <Router>
    <Page
      {...props}
    >
      <PageTabs
        sections={props.tabs}
      >
        <Switch>
          {props.tabs.map((tab, tabIndex) =>
            <Route
              {...tab}
              key={`tab-actions-${tabIndex}`}
              component={tab.actions}
            />
          )}
        </Switch>
      </PageTabs>

      <PageContent>
        <Switch>
          {props.tabs.map((tab, tabIndex) =>
            <Route
              {...tab}
              key={`tab-actions-${tabIndex}`}
              component={tab.content}
            />
          )}

          {props.redirect.map((redirect, redirectIndex) =>
            <Redirect
              {...redirect}
              key={`tab-redirect-${redirectIndex}`}
            />
          )}
        </Switch>
      </PageContent>
    </Page>
  </Router>

implementPropTypes(TabbedPage, PageTypes, {
  tabs: T.arrayOf(T.shape({

  })).isRequired,
  redirect: T.arrayOf(T.shape({

  }))
}, {
  redirect: []
})

export {
  TabbedPage
}
