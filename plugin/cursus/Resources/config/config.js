var coursesManagement = function (userId) {
  return Routing.generate('claro_cursus_user_sessions_management', {user: userId})
}

module.exports = {
  actions: [
    {
      name: (Translator) => Translator.trans('courses_management', {}, 'cursus'),
      url: coursesManagement,
      type: 'administration_users',
      class: 'fa fa-list-alt'
    }
  ]
}
