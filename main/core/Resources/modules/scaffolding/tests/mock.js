import {mock as mockAsset} from '#/main/core/scaffolding/asset/mock'
import {mock as mockRouter} from '#/main/app/api/router/mock'
import {mock as mockTranslation} from '#/main/app/intl/translation/mock'
import {mock as mockTinyMce} from '#/main/core/tinymce/mock'

let mocked = false

/**
 * Mocks global Claroline app components.
 */
function mock() {
  if (!mocked) {
    mockAsset()
    mockTranslation()
    mockRouter()
    mockTinyMce()

    mocked = true
  }
}

export {
  mock
}
