import {t} from '#/main/core/translation'

import {HtmlGroup} from '#/main/core/layout/form/components/group/html-group.jsx'
import {HtmlCell} from '#/main/core/data/types/html/components/table.jsx'

const FILE_TYPE = 'file'

// todo implement

const fileDefinition = {
  meta: {
    creatable: true,
    icon: 'fa fa-fw fa fa-file-o',
    label: t('file'),
    description: t('file_desc')
  },
  // nothing special to do
  parse: (display) => display,
  // nothing special to do
  render: (raw) => raw,
  validate: (value) => typeof value === 'string',
  components: {
    // todo : add file download in table
    // todo : add
  }
}

export {
  FILE_TYPE,
  fileDefinition
}
