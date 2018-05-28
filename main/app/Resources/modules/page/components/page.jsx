import React from 'react'
import classes from 'classnames'
import omit from 'lodash/omit'

import {PropTypes as T, implementPropTypes} from '#/main/app/prop-types'
import {Page as PageTypes} from '#/main/app/page/prop-types'

import {Router} from '#/main/app/router'
import {ModalOverlay} from '#/main/app/overlay/modal/containers/overlay'
import {AlertOverlay} from '#/main/app/overlay/alert/containers/overlay'

import {PageHeader} from '#/main/app/page/components/header'

const PageWrapper = props =>
  <Router embedded={props.embedded}>
    {!props.embedded ?
      <main className={classes('page', props.className)}>
        {props.children}
      </main> :
      <section className={classes('page', props.className)}>
        {props.children}
      </section>
    }
  </Router>

PageWrapper.propTypes = {
  className: T.string,
  embedded: T.bool.isRequired,
  children: T.node
}

/**
 * Root of the current page.
 *
 * For now, modals are managed here.
 * In future version, when the layout will be in React,
 * it'll be moved in higher level.
 */
const Page = props =>
  <PageWrapper
    embedded={props.embedded}
    className={classes(props.className, {
      fullscreen: props.fullscreen,
      main: !props.embedded,
      embedded: props.embedded
    })}
  >
    <AlertOverlay />

    <PageHeader
      {...omit(props, 'className', 'embedded', 'fullscreen', 'children')}
      actions={props.actions.filter(action => undefined === action.displayed || action.displayed)}
    />

    {props.children}

    <ModalOverlay />
  </PageWrapper>

implementPropTypes(Page, PageTypes, {
  children: T.node.isRequired
})

export {
  Page
}
