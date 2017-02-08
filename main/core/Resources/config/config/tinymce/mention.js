import $ from 'jquery'
import _ from 'lodash'
import home from '#/main/core/_old/home/home'
import 'tinymce-mention'
import 'tinymce-mention/css/autocomplete.css'
import './mention.css'

const routing = window.Routing

export default class Mention {
  constructor() {
    this.delay = 500
    this.source = this._source
    this.render = this._render
    this.insert = this._insert
  }

  _source(query, process, delimiter) {
    let workspace = window.Workspace
    if (!_.isUndefined(workspace) && !_.isNull(workspace.id)) {
      if (delimiter === '@' && query.length > 0) {
        let searchUserInWorkspaceUrl = routing.generate('claro_user_search_in_workspace') + '/'

        $.getJSON(searchUserInWorkspaceUrl + workspace.id + '/' + query, function (data) {
          if (!_.isEmpty(data) && !_.isUndefined(data.users) && !_.isEmpty(data.users)) {
            process(data.users)
          }
        })
      }
    }
  }

  _render(item) {
    let avatar = '<i class="fa fa-user"></i>'
    if (item.avatar !== null) {
      avatar = `<img src="${home.asset + 'uploads/pictures/' + item.avatar}" alt="${item.name}" class="img-responsive">`
    }

    return `<li>
              <a href="javascript:;">
                <span class="user-picker-dropdown-avatar">${avatar}</span>
                <span class="user-picker-dropdown-name">${item.name}</span>
                <small class="user-picker-avatar-mail text-muted">${item.mail}</small>
              </a>
            </li>`
  }

  _insert(item) {
    let publicProfileUrl = routing.generate('claro_public_profile_view') + '/'

    return '<user id="' + item.id + '"><a href="' + publicProfileUrl + item.id + '">' + item.name + '</a></user>'
  }
}
