import {LocaleGroup} from '#/main/core/layout/data/types/locale/components/form-group.jsx'

const LOCALE_TYPE = 'locale'

import {t} from '#/main/core/translation'

const localeDefinition = {
  parse: (display) => parseFloat(display),
  render: (raw) => t(raw),
  validate: (value) => true,
  components: {
    form: LocaleGroup
  }
}

export {
  LOCALE_TYPE,
  localeDefinition
}
