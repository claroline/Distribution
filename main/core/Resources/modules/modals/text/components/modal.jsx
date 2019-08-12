import React, {Component, Fragment} from 'react'
import {PropTypes as T} from 'prop-types'

import {trans} from '#/main/app/intl/translation'
import {Button} from '#/main/app/action/components/button'
import {Modal} from '#/main/app/overlays/modal/components/modal'
import {ListData} from '#/main/app/content/list/containers/data'
import {selectors} from '#/main/core/modals/groups/store'
import {CALLBACK_BUTTON} from '#/main/app/buttons'

class TextModal extends Component {
  constructor(props) {
    super(props)

    this.state = {text: '', fetched: false}
  }


  render() {
    return(
      <Modal
        {...this.props}
        icon="fa fa-fw fa-users"
        className="data-text-modal"
        bsSize="lg"
        onExiting={this.resetText}
      >
        {!this.state.fetched &&
      <Fragment>
        <textarea
          rows={20}
          className={'form-control'}
          onChange={event => this.setState({text: event.target.value})}
        />
        <Button
          label={trans('search')}
          className="modal-btn btn"
          primary={true}
          type={CALLBACK_BUTTON}
          callback = {() => {
            this.props.search(this.props.fetch.url, this.state.text)
            this.setState({fetched: true})
          }}
        />
      </Fragment>
        }
        {this.state.fetched &&
        <Fragment>
          <ListData
            name={selectors.STORE_NAME}
            definition={this.props.definition}
            card={this.props.card}
            data={this.props.data}
            fetch={this.props.fetch}
            selectable={false}
            filterable={false}
            paginated={true}
            sortable={true}
          />
          <Button
            label={trans('submit')}
            className="modal-btn btn"
            primary={true}
            type={CALLBACK_BUTTON}
            callback = {() => {
              this.props.handleSelect(this.props.data)
            }}
          />
        </Fragment>
        }
      </Modal>)
  }

}

TextModal.propTypes = {
  fetch: T.object,
  title: T.string,
  fadeModal: T.func.isRequired,
  search: T.func.isRequired,
  resetText: T.func.isRequired,
  definition: T.object.isRequired,
  card: T.object.isRequired,
  handleSelect: T.function.isRequired,
  data: T.array
}

export {
  TextModal
}
