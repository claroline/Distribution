import React, {Component} from 'react'
import {PropTypes as T} from 'prop-types'

import {t} from '#/main/core/translation'

import {TooltipButton} from '#/main/core/layout/button/components/tooltip-button.jsx'
import {Ip} from '#/main/core/layout/form/components/field/ip.jsx'

const IpList = props =>
  <div className="ip-list-control">
    <div className="ip-item ip-add">
      <Ip
        size="sm"
        value=""
        onChange={() => true}
      />

      <TooltipButton
        id={`ipp-add`}
        title={t('delete')}
        onClick={() => true}
        className="btn-link"
      >
        <span className="fa fa-fw fa-plus" />
      </TooltipButton>
    </div>

    {0 !== props.ips.length &&
      <a className="btn btn-sm btn-link-danger">remove all</a>
    }

    {0 !== props.ips.length &&
      <ul>
        {props.ips.map(ip =>
          <li key={ip} className="ip-item">
            <Ip
              size="sm"
              value={ip}
              onChange={() => true}
            />

            <TooltipButton
              id={`${ip}-btn-delete`}
              title={t('delete')}
              onClick={() => true}
              className="btn-link-danger"
            >
              <span className="fa fa-fw fa-trash-o" />
            </TooltipButton>
          </li>
        )}
      </ul>
    }
  </div>

IpList.propTypes = {
  ips: T.arrayOf(T.string).isRequired,
  onChange: T.func.isRequired
}

export {
  IpList
}
