export default class FormBuilderService {
  constructor ($httpParamSerializerJQLike, Upload) {
    this.$httpParamSerializerJQLike = $httpParamSerializerJQLike
    this.Upload = Upload
  }

  submit(url, parameters) {
      return this.Upload.upload({
          url: url,
          data: parameters
      })
  }

  // copy pasted from ClarolineAPIService. Where should it go ?
  generateQueryString (array, name) {
    var qs = ''

    for (var i = 0; i < array.length; i++) {
      var id = (array[i].id) ? array[i].id : array[i]
      qs += name + '[]=' + id + '&'
    }

    return qs
  }
}
