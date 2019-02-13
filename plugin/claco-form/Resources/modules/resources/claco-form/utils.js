import {constants as intlConstants} from '#/main/app/intl/constants'

const generateFieldKey = (id) => `%field_${id}%`

// TODO : move elsewhere
const getCountry = (value) => intlConstants.REGIONS[value] || null

// TODO : move elsewhere
const getFileType = (mimeType) => {
  const typeParts = mimeType.split('/')
  let type = 'file'

  if (typeParts[0] && ['image', 'audio', 'video'].indexOf(typeParts[0]) > -1) {
    type = typeParts[0]
  } else if (typeParts[1]) {
    type = typeParts[1]
  }

  return type
}

export {
  generateFieldKey,
  getCountry,
  getFileType
}