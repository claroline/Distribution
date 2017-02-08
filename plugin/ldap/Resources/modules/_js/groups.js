import ldap from '../ldap'

ldap.setAttribute('entries', window.groupsJSON)
ldap.setAttribute('groupName', window.groupName)
ldap.setAttribute('groupCode', window.groupCode)
ldap.showPreview()
