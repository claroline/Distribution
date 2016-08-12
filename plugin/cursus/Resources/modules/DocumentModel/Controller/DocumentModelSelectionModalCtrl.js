/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

export default class DocumentModelSelectionModalCtrl {
  constructor(DocumentModelService, datas, documentType, callback) {
    this.DocumentModelService = DocumentModelService
    this.datas = datas
    this.documentType = documentType
    this.title = DocumentModelService.getDocumentTypeName(documentType)
    this.callback = callback
    this.documentModel = {}
    this.documentModels = []
    this.initialize()
  }

  initialize () {
    this.DocumentModelService.getDocumentModelsByType(this.documentType).then(d => {
      d.forEach(dc => this.documentModels.push(dc))
    })
  }

  submit () {

  }
}
