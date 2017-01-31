import React, {Component, PropTypes as T} from 'react'
import Modal from 'react-bootstrap/lib/Modal'

import {generateUrl} from './../../../utils/routing'
import {update} from './../../../utils/utils'
import {t, tex} from './../../../utils/translate'
import {FormGroup} from './../../../components/form/form-group.jsx'
import {BaseModal} from './../../../modal/components/base.jsx'

export const MODAL_SHARE = 'MODAL_SHARE'

const UsersSelected = props =>
  <ul className="list-group">
    {props.users.map((user) =>
      <li onClick={() => props.deselect(user)}>
        {user.name}
      </li>
    )}
  </ul>

UsersSelected.propTypes = {
  users: T.arrayOf(T.shape({
    id: T.string.isRequired,
    name: T.string.isRequired
  })).isRequired,
  deselect: T.func.isRequired
}

const UsersList = props =>
  <ul>
    {props.users.map((user) =>
      <li onClick={() => props.select(user)}>
        {user.name}
      </li>
    )}
  </ul>

UsersList.propTypes = {
  users: T.arrayOf(T.shape({
    id: T.string.isRequired,
    name: T.string.isRequired
  })).isRequired,
  select: T.func.isRequired
}

export class ShareModal extends Component {
  constructor(props) {
    super(props)

    this.state = {
      adminRights: false,
      users: [],
      search: []
    }
  }

  getUsers(search) {
    fetch(generateUrl('questions_share_users', {search: search}), {
      method: 'GET' ,
      credentials: 'include'
    })
      .then(response => response.json())
      .then(users => this.setState({search: users}))
  }

  selectUser(user) {
    this.setState(update(this.state, {users: {$push: [user]}}))
  }

  deselectUser(user) {
    this.setState(update(this.state, {
      users: {$splice: [[this.state.indexOf(user), 1]]}
    }))
  }

  render() {
    return (
      <BaseModal {...this.props} className="share-modal">
        <Modal.Body>
          <div className="checkbox">
            <label htmlFor="share-admin-rights">
              <input
                id="share-admin-rights"
                type="checkbox"
                name="share-admin-rights"
                checked={this.state.adminRights}
                onChange={() => this.setState('adminRights', !this.state.adminRights)}
              />
              {tex('share_admin_rights')}
            </label>
          </div>

          <FormGroup
            controlId="share-users"
            label={tex('share_with')}
          >
            <div className="dropdown">
              <input
                id="share-users"
                type="text"
                className="form-control"
                onChange={e => e.target.value && 2 < e.target.value.length ?
                  this.getUsers(e.target.value) : true
                }
              />
              {0 < this.state.search.length &&
                <UsersList
                  users={this.state.search}
                  select={this.selectUser.bind(this)}
                />
              }

              {0 < this.state.users.length &&
                <UsersSelected
                  users={this.state.users}
                  deselect={this.deselectUser.bind(this)}
                />
              }
            </div>
          </FormGroup>
        </Modal.Body>

        <Modal.Footer>
          <button className="btn btn-default" onClick={this.props.fadeModal}>
            {t('cancel')}
          </button>
          <button
            className="btn btn-primary"
            onClick={() => this.props.handleShare(this.state.users, this.state.adminRights)}
          >
            {tex('share')}
          </button>
        </Modal.Footer>
      </BaseModal>
    )
  }
}

ShareModal.propTypes = {
  handleShare: T.func.isRequired,
  searchUsers: T.func.isRequired,
  clearUsers: T.func.isRequired,
}
