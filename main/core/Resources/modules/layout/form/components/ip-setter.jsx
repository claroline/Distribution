import React, {PropTypes as T, Component} from 'react'
import {tex} from '#/main/core/translation'

export class IpSetter extends Component {
  constructor(props) {
    super(props)
  }

  addIpFilter() {
    this.props.ips.push('0.0.0.0')
  }

  render() {
    return (
      <div>
        <form className="form-inline">
          <input
            min="0"
            id="ip-block-1"
            name="ip-block-1"
            max="255"
            className="form-control mb-2 mr-sm-2 mb-sm-0"
            type="number"
          />{'\u00A0'}.{'\u00A0'}
          <input
            min="0"
            id="ip-block-2"
            name="ip-block-2"
            max="255"
            className="form-control mb-2 mr-sm-2 mb-sm-0"
            type="number"
          />{'\u00A0'}.{'\u00A0'}
          <input
            min="0"
            id="ip-block-3"
            name="ip-block-3"
            max="255"
            className="form-control mb-2 mr-sm-2 mb-sm-0"
            type="number"
          />{'\u00A0'}.{'\u00A0'}
          <input
            min="0"
            id="ip-block-4"
            name="ip-block-4"
            max="255"
            className="form-control mb-2 mr-sm-2 mb-sm-0"
            type="number"
          />
          {'\u00A0'}
          <input
            className="btn btn-primary"
            type="button"
            value={tex('add_filter')}
            onClick={this.addIpFilter}
          />
          {'\u00A0'}
          <input
            className="btn btn-danger"
            type="button"
            value={tex('remove_all_filter')}
          />
        </form>
        <div>
          {this.props.ips.map(ip => <IPSpan ip={ip}/>)}
        </div>
      </div>
    )
  }
}

const IPSpan = props => <div>{props}<i className="fa fa-times fa-fw"/></div>

IPSpan.proptype = {
  ip: T.string.isRequired
}

IpSetter.propTypes = {
  ips: T.arrayOf(T.string).isRequired
}

IpSetter.defaultProps = {
  ips: []
}
