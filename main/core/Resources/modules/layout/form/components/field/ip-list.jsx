import React, {Component} from 'react'
import {PropTypes as T} from 'prop-types'

import {t} from '#/main/core/translation'

import {TooltipButton} from '#/main/core/layout/button/components/tooltip-button.jsx'
import {HelpBlock} from '#/main/core/layout/form/components/help-block.jsx'
import {Ip} from '#/main/core/layout/form/components/field/ip.jsx'
import {ipDefinition} from '#/main/core/data/types/ip'

class IpList extends Component {
  constructor(props) {
    super(props)

    this.state = {
      pendingIp: ''
    }

    this.addIp         = this.addIp.bind(this)
    this.updateIp      = this.updateIp.bind(this)
    this.updatePending = this.updatePending.bind(this)
    this.removeIp      = this.removeIp.bind(this)
    this.removeAll     = this.removeAll.bind(this)
  }

  addIp() {
    const newIps = this.props.value.slice()

    newIps.push(this.state.pendingIp)

    this.updatePending('')

    this.props.onChange(newIps)
  }

  updatePending(newIp) {
    this.setState({
      pendingIp: newIp
    })
  }

  updateIp(index, newIp) {
    const newIps = this.props.value.slice()

    // update
    newIps[index] = newIp

    this.props.onChange(newIps)
  }

  removeIp(index) {
    const newIps = this.props.value.slice()

    // remove
    newIps.splice(index, 1)

    this.props.onChange(newIps)
  }

  removeAll() {
    this.props.onChange([])
  }

  render() {
    return (
      <div id={this.props.id} className="ip-list-control">
        <div className="ip-item ip-add">
          <Ip
            id={`${this.props.id}-add`}
            size="sm"
            value={this.state.pendingIp}
            disabled={this.props.disabled}
            onChange={this.updatePending}
          />

          <TooltipButton
            id={`${this.props.id}-add-btn`}
            title={t('add')}
            className="btn-link"
            disabled={this.props.disabled || !ipDefinition.validate(this.state.pendingIp)}
            onClick={this.addIp}
          >
            <span className="fa fa-fw fa-plus" />
          </TooltipButton>
        </div>

        <HelpBlock help={t('ip_input_help')} />

        {0 !== this.props.value.length &&
          <button
            type="button"
            className="btn btn-sm btn-link-danger"
            disabled={this.props.disabled}
            onClick={!this.props.disabled && this.removeAll}
          >
            {t('delete_all')}
          </button>
        }

        {0 !== this.props.value.length &&
          <ul>
            {this.props.value.map((ip, index) =>
              <li key={`${this.props.id}-${index}`} className="ip-item">
                <Ip
                  id={`${this.props.id}-auth-${index}`}
                  size="sm"
                  placeholder=""
                  value={ip}
                  disabled={this.props.disabled}
                  onChange={ip => this.updateIp(index, ip)}
                />

                <TooltipButton
                  id={`${this.props.id}-auth-${index}-delete`}
                  title={t('delete')}
                  className="btn-link-danger"
                  disabled={this.props.disabled}
                  onClick={() => this.removeIp(index)}
                >
                  <span className="fa fa-fw fa-trash-o" />
                </TooltipButton>
              </li>
            )}
          </ul>
        }

        {0 === this.props.value.length &&
          <div className="no-ip-info">{this.props.placeholder}</div>
        }
      </div>
    )
  }
}

IpList.propTypes = {
  id: T.string.isRequired,
  value: T.arrayOf(T.string).isRequired,
  disabled: T.bool,
  onChange: T.func.isRequired,
  placeholder: T.string
}

IpList.defaultProps = {
  disabled: false,
  placeholder: t('no_ip')
}

export {
  IpList
}
