import React from 'react'
import {PropTypes as T} from 'prop-types'
import classes from 'classnames'

import {Router, Routes, NavLink} from '#/main/core/router'
import {Page, PageContent} from '#/main/core/layout/page/components/page.jsx'
import {PageActions, PageAction} from '#/main/core/layout/page/components/page-actions.jsx'

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
  children: T.node
}

const SectionedPage = props =>
  <Router>
    <Page>
      <PageTabs
        sections={props.sections}
      >
        <PageActions>
          <PageAction
            id="workspace-add"
            title="Create"
            icon="fa fa-plus"
            primary={true}
            action="#"
          />

          <PageAction
            id="workspaces-import"
            title="Import"
            icon="fa fa-download"
            action="#"
          />
        </PageActions>
      </PageTabs>

      <PageContent>
        <Routes
          routes={props.sections}
        />
      </PageContent>
    </Page>
  </Router>

SectionedPage.propTypes = {
  sections: T.arrayOf(T.shape({
    path: T.string.isRequired,
    icon: T.string.isRequired,
    title: T.string.isRequired,
    actions: T.arrayOf(T.shape({

    })),
    component: T.any.isRequired
  })).isRequired
}

export {
  SectionedPage
}
