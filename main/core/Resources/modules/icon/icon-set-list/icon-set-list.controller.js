export default class IconSetListController {
  constructor(iconSetService) {
    this._iconSetService = iconSetService
    this.iconSets = []
    this._init()
  }

  removeIconSet(iconSet) {
    this._iconSetService.remove(iconSet).then( iconSets => {
      this.iconSets = iconSets
    }, () => {})
  }

  _init() {
    this._iconSetService.getList().then(iconSets => {
      this.iconSets = iconSets
    }, () => {
      this.iconSets = []
    })
  }
}
IconSetListController.$inject = ['iconSetService']