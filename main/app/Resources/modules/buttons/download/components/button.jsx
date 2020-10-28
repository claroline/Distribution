import React from 'react'
import omit from 'lodash/omit'

import {PropTypes as T, implementPropTypes} from '#/main/app/prop-types'

import {Button as ButtonTypes} from '#/main/app/buttons/prop-types'
import {UrlButton} from '#/main/app/buttons/url/components/button'

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

implementPropTypes(DownloadButton, ButtonTypes, {
  file: T.shape({
    name: T.string,
    mimeType: T.string,
    url: T.oneOfType([T.string, T.array]).isRequired
  }).isRequired
})

export {
  DownloadButton
}
