export default class ProfileController {
  constructor ($http, $scope, FormBuilderService) {
    this.$http = $http
    this.$scope = $scope
    this.FormBuilderService = FormBuilderService
    this.user = []
    this.arLinks = []
    this.facets = []
    this.userId = window['userId']
    this.disabled = true
    this.profileModeLabel = Translator.trans('edit_profile', {}, 'platform');

    $http.get(Routing.generate('api_get_connected_user')).then(d => this.user = d.data)
    $http.get(Routing.generate('api_get_profile_links', {user: this.userId})).then(d => this.arLinks = d.data)
    $http.get(Routing.generate('api_get_profile_facets', {user: this.userId})).then(d => this.facets = d.data)
    this.fieldTypes = ['text', 'number', 'date', 'radio', 'select', 'checkboxes', 'country']
  }

  onSubmit (facet) {
    const fields = []

    facet.panels.forEach(panel => {
      panel.fields.forEach(field => {
        fields.push(field)
      })
    })

    var data = this.FormBuilderService.formSerialize('fields', fields)

    this.$http.put(
      Routing.generate('api_put_profile_fields', {user: this.userId}),
      data,
      {headers: {'Content-Type': 'application/x-www-form-urlencoded'}}
    ).then(
      d => {
      },
      d => alert('an error occured')
    )
  }

  isDisabled(panel)
  {
      return this.disabled && panel.is_editable
  }

  switchProfileMode() {
    if (this.disabled) {
        this.disabled = false
        this.profileModeLabel = Translator.trans('display_mode', {}, 'platform')
    } else {
        this.disabled = true
        this.profileModeLabel = Translator.trans('edit_mode', {}, 'platform')
    }
  }
}
