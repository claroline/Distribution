import {trans} from '#/main/core/translation'

export function t_res(key, placeholders = {}) {
  return trans(key, placeholders, 'resource')
}
