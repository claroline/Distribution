import React from 'react'
import {PropTypes as T} from 'prop-types'

import {Route} from '#/main/core/router'

/**
 * HOC to transform any component in a `PageSection` to work with `SectionedPage` and `RoutedPage`.
 *
 * @param sectionProps
 *
 * @returns {function}
 */
function makePageSection(sectionProps) {
  return (SectionComponent) => {
    const Section = props => {
      //console.log(props.children)

      return (
        <PageSection
          path={sectionProps.path}
          exact={sectionProps.exact}
          icon={sectionProps.icon}
          title={sectionProps.title}
          actions={sectionProps.actions}
        >
          <SectionComponent {...props} />
        </PageSection>
      )
    }

    Section.displayName = `PageSection(${sectionProps.title})`

    return Section
  }
}

makePageSection.propTypes = {
  path: T.string.isRequired,
  exact: T.bool,
  icon: T.string.isRequired,
  title: T.string.isRequired,
  actions: T.arrayOf(T.shape({

  }))
}

const PageSection = props =>
  <Route
    path={props.path}
    exact={props.exact}
    component={() => props.children}
  />

PageSection.propTypes = {
  path: T.string.isRequired,
  exact: T.bool,
  icon: T.string.isRequired,
  title: T.string.isRequired,
  actions: T.arrayOf(T.shape({

  })),
  children: T.any.isRequired
}

export {
  makePageSection,
  PageSection
}
