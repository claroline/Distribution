import React from 'react'
import {PropTypes as T} from 'prop-types'
import merge from 'lodash/merge'
import omit from 'lodash/omit'

import {Button as ButtonTypes} from '#/main/app/button/prop-types'
import {UrlButton} from '#/main/app/button/components/url'

/**
 * Download button.
 * Renders a component that will trigger a file download on click.
 *
 * @param props
 * @constructor
 */
const DownloadButton = props =>
  <UrlButton
    {...omit(props, 'file')}
    target={props.file.url}
  >
    {props.children || props.file.name || props.file.url}
  </UrlButton>

DownloadButton.propTypes = merge({}, ButtonTypes.propTypes, {
  file: T.shape({
    name: T.string,
    mimeType: T.string,
    url: T.string.isRequired
  }).isRequired
})

DownloadButton.defaultProps = merge({}, ButtonTypes.defaultProps)

export {
  DownloadButton
}
