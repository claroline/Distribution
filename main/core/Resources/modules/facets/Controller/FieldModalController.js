export default class ModalController {
  constructor (form, title, submit, model, $uibModalInstance, $http, FormBuilderService) {
    this.form = form
    this.title = title
    this.submit = submit
    this.model = this.field = model
    this.$uibModalInstance = $uibModalInstance
    this.FormBuilderService = FormBuilderService
    this.newChoice = {}
    this.$http = $http
    this.idChoice = 1
  }

  onSubmit (form) {
    if (form.$valid) this.$uibModalInstance.close(this.model)
  }

  addChoice () {
      //if the fiels already exists
      if (this.model.id) {
          var data = this.FormBuilderService.formSerialize('choice', this.newChoice)
          this.$http.post(
            Routing.generate('api_post_facet_field_choice', {field: this.field.id}),
            data,
            {headers: {'Content-Type': 'application/x-www-form-urlencoded'}}
          ).then(
            d => {
             this.model.field_facet_choices.push(d.data)
            },
            d => {
              alert('error handling')
            }
          )
      } else {
          if (!this.model.field_facet_choices) this.model.field_facet_choices = []
          this.model.field_facet_choices.push({name: this.newChoice.name, id: this.idChoice})
          this.idChoice++
      }

      this.newChoice = {}
  }

  removeChoice(choice) {
      this.$http.delete(
        Routing.generate('api_delete_facet_field_choice', {choice: choice.id})
      ).then(
        d => {
         alert('removed')
        },
        d => {
          alert('error handling')
        }
      )
  }
}
