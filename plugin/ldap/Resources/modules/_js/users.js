import ldap from '../ldap'

ldap.setAttribute(window.usersJSON)
ldap.setAttribute('userName', window.userName)
ldap.setAttribute('firstName', window.firstName)
ldap.setAttribute('lastName', window.lastName)
ldap.setAttribute('email', window.email)
ldap.setAttribute('code', window.code)
ldap.setAttribute('locale', window.locale)
ldap.showPreview()
