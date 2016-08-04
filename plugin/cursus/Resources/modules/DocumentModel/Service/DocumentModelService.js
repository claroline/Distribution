/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

/*global Routing*/
/*global Translator*/

export default class DocumentModelService {
  constructor ($http, ClarolineAPIService) {
    this.$http = $http
    this.ClarolineAPIService = ClarolineAPIService
  }

  getAllDocumentModels () {
    const url = Routing.generate('api_get_cursus_document_models')

    return this.$http.get(url).then(d => {
      if (d['status'] === 200) {
        return JSON.parse(d['data'])
      }
    })
  }

  getDocumentModelById (modelId) {
    const url = Routing.generate('api_get_cursus_document_model', {documentModel: modelId})

    return this.$http.get(url).then(d => {
      if (d['status'] === 200) {
        return JSON.parse(d['data'])
      }
    })
  }

  getDocumentTypeName (documentType) {
    let name = ''

    switch (documentType) {
    case 0 :
      name = Translator.trans('session_invitation', {}, 'cursus')
      break
    case 1 :
      name = Translator.trans('session_event_invitation', {}, 'cursus')
      break
    case 2 :
      name = Translator.trans('session_certificate', {}, 'cursus')
      break
    default :
      break
    }

    return name
  }

  deleteDocumentModel (documentModelId, callback = null) {
    const url = Routing.generate('api_delete_cursus_document_model', {documentModel: documentModelId})
    this.ClarolineAPIService.confirm(
      {url, method: 'DELETE'},
      callback,
      Translator.trans('delete_document_model', {}, 'cursus'),
      Translator.trans('delete_document_model_confirm_message', {}, 'cursus')
    )
  }
}