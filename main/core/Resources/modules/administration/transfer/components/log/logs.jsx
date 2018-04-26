import React, {Component} from 'react'
import {PropTypes as T} from 'prop-types'

import {trans} from '#/main/core/translation'
import {Error} from '#/main/core/administration/transfer/components/modal/log/components/error'
import {Success} from '#/main/core/administration/transfer/components/modal/log/components/success'

export const Logs = props =>
  <div>
    <pre>
      processed: {props.data.processed} {'\n'}
      error: {props.data.error} {'\n'}
      success: {props.data.success} {'\n'}
      total: {props.data.total} {'\n'}
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
              {props.data.log}
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
            {props.data.data &&
              Object.keys(props.data.data.success).map(action => {
                return(
                  <div>
                    <h4>{action}</h4>
                    {props.data.data.success[action].map(success =>  <Success {...success}/>)}
                  </div>
                )}
              )
            }
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
            {props.data.data &&
              props.data.data.error.map(error => <Error {...error}/>)
            }
          </div>
        </div>
      </div>
    </div>
  </div>
