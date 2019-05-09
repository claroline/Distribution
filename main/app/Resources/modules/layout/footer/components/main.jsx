import React from 'react'

import {param} from '#/main/app/config'

const FooterMain = (props) =>
  <footer className="app-footer-container">
    <div className="app-footer" role="presentation">
      <a href="www.claroline.net">Claroline Connect</a>
      <small>{param('version')}</small>
    </div>
  </footer>

FooterMain.propTypes = {

}

export {
  FooterMain
}
