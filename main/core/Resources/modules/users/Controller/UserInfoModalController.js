export default class UserInfoModalController {
  constructor (user) {
    this.user = user
    this.rolesList = ''

    const platformRoles = user.roles.filter(role => {
    //platform type
      return role.type === 1})

    platformRoles.forEach((role, i) => {
      this.rolesList += this.translate(platformRoles[i].translation_key)
      if (i < platformRoles.length - 1) this.rolesList += ', '
    })
  }

  translate (key, parameters = {}) {
    return window.Translator.trans(key, parameters, 'platform')
  }
}
