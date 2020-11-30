import React from 'react'
import classes from 'classnames'
import {Helmet} from 'react-helmet'

import {implementPropTypes} from '#/main/app/prop-types'

import {PageSimple as PageSimpleTypes} from '#/main/app/page/prop-types'
import {PageBreadcrumb} from '#/main/app/page/components/breadcrumb'
import {PageWrapper} from '#/main/app/page/components/wrapper'

// TODO : remove styles management

/**
 * Root of the current page.
 */
const PageSimple = props =>
  <PageWrapper
    id={props.id}
    embedded={props.embedded}
    className={classes(props.className, props.size, {
      fullscreen: props.fullscreen,
      main: !props.embedded,
      embedded: props.embedded
    })}
  >
    <Helmet>
      {!props.embedded && props.meta && props.meta.title &&
        <title>{props.meta.title}</title>
      }
      {!props.embedded && props.meta && props.meta.description &&
        <meta name="description" content={props.meta.description} />
      }
    </Helmet>

    {!props.embedded &&
      <PageBreadcrumb
        path={props.path}
        className={classes({
          'sr-only': !props.showBreadcrumb || props.fullscreen
        })}
      />
    }

    {props.children}
  </PageWrapper>

implementPropTypes(PageSimple, PageSimpleTypes)

export {
  PageSimple
}
