import React, {Component} from 'react'
import {PropTypes as T} from 'prop-types'
import Modal from 'react-bootstrap/lib/Modal'

import {connect} from 'react-redux'
import {trans} from '#/main/core/translation'
import {BaseModal} from '#/main/core/layout/modal/components/base.jsx'
import {actions} from '#/main/core/administration/transfer/components/modal/log/actions'
import {Error} from '#/main/core/administration/transfer/components/modal/log/components/error'


  /*this.props.data.log.map(error => <Error {...error} />)*/

class LogModal extends Component {
  render() {
    return (
      <BaseModal {...this.props}>
        <Modal.Body>
          <pre>
            processed: {this.props.data.processed} {'\n'}
            error: {this.props.data.error} {'\n'}
            success: {this.props.data.success} {'\n'}
            total: {this.props.data.total} {'\n'}
          </pre>

          <div className="panel-group" id="accordion" role="tablist" aria-multiselectable="true">
            <div className="panel panel-default">
              <div className="panel-heading" role="tab" id="headingOne">
                <h4 className="panel-title">
                  <a role="button" data-toggle="collapse" data-parent="#accordion" href="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                    {trans('log')}
                  </a>
                </h4>
              </div>
              <div id="collapseOne" className="panel-collapse collapse in" role="tabpanel" aria-labelledby="headingOne">
                <div className="panel-body">
                  <pre>
                    {this.props.data.log}
                  </pre>
                </div>
              </div>
            </div>
            <div className="panel panel-default">
              <div className="panel-heading" role="tab" id="headingTwo">
                <h4 className="panel-title">
                  <a className="collapsed" role="button" data-toggle="collapse" data-parent="#accordion" href="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                    {trans('success')}
                  </a>
                </h4>
              </div>
              <div id="collapseTwo" className="panel-collapse collapse" role="tabpanel" aria-labelledby="headingTwo">
                <div className="panel-body">
                  Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon officia aute, non cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon tempor, sunt aliqua put a bird on it squid single-origin coffee nulla assumenda shoreditch et. Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident. Ad vegan excepteur butcher vice lomo. Leggings occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt you probably haven't heard of them accusamus labore sustainable VHS.
                </div>
              </div>
            </div>
            <div className="panel panel-default">
              <div className="panel-heading" role="tab" id="headingThree">
                <h4 className="panel-title">
                  <a className="collapsed" role="button" data-toggle="collapse" data-parent="#accordion" href="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                    {trans('error')}
                  </a>
                </h4>
              </div>
              <div id="collapseThree" className="panel-collapse collapse" role="tabpanel" aria-labelledby="headingThree">
                <div className="panel-body">
                  {this.props.data.data &&
                    this.props.data.data.error.map(error => <Error {...error}/>)
                  }
                </div>
              </div>
            </div>
          </div>
        </Modal.Body>
        <button
          className="modal-btn btn btn-primary"
          onClick={() => this.props.fadeModal()}
        >
          {trans('hide')}
        </button>
      </BaseModal>
    )
  }

  componentDidMount() {
    const refresher = setInterval(() => {
      this.props.load(this.props.file)
      if (this.props.data.total !== undefined && this.props.data.processed === this.props.data.total) {
          clearInterval(refresher)
      }
    }, 2000)
  }
}

LogModal.propTypes = {
  data: T.object.isRequired,
  fadeModal: T.func.isRequired,
  file: T.string.isRequired,
  load: T.func.isRequired
}

LogModal.defaultProps = {
  bsStyle: 'info',
  content: ''
}

const ConnectedModal = connect(
  state => ({
    data: state.log
  }),
  dispatch => ({
    load(file) {
      dispatch(actions.load(file))
    }
  })
)(LogModal)

export {ConnectedModal as LogModal}
