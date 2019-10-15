import React, {Component} from 'react'
import {PropTypes as T} from 'prop-types'
import {PDFJS} from 'pdfjs-dist/build/pdf.combined'

import {transChoice} from '#/main/app/intl/translation'
import {Pdf as PdfTypes} from '#/plugin/pdf-player/files/pdf/prop-types'

class PdfPlayer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      pdf: null,
      page: 1,
      scale: 100,
      context: null
    }
  }

  componentDidMount() {
    PDFJS.disableRange = true
    PDFJS.disableWorker = true
    PDFJS.getDocument(this.props.file.url).then((pdf) => {
      this.setState({
        pdf: pdf,
        context: document.getElementById('pdf-canvas-' + this.props.file.id).getContext('2d')
      }, () => this.renderPage())
    }).catch(() => this.props.setErrors())
  }

  renderPage() {
    this.state.pdf.getPage(this.state.page).then(page => {
      const viewport = page.getViewport(this.state.scale / 100)
      const canvas = document.getElementById('pdf-canvas-' + this.props.file.id)
      canvas.height = viewport.height
      canvas.width = viewport.width

      // Render PDF page into canvas context
      const renderContext = {
        canvasContext: this.state.context,
        viewport: viewport
      }
      page.render(renderContext)
    })
  }

  changePage(requestPageNum) {
    let pageNum = requestPageNum

    if (!pageNum || 1 >= pageNum) {
      pageNum = 1
    } else if (pageNum > this.state.pdf.numPages) {
      pageNum = this.state.pdf.numPages
    }
    this.setState({page: parseInt(pageNum)}, () => this.renderPage())
  }

  zoom(requestScale) {
    let scale = requestScale

    if (1 >= scale) {
      scale = 1
    }
    this.setState({scale: parseInt(scale)}, () => this.renderPage())
  }

  render() {
    return (
      <div className="pdf-player-component">
        <div className="pdf-player-menu">
          <div className="pdf-pages">
            <button
              className="btn btn-link-default"
              disabled={!this.state.page || 1 >= this.state.page}
              onClick={() => this.changePage(this.state.page - 1)}
            >
              <span className="fa fa-fw fa-backward" />
            </button>
            <button
              className="btn btn-link-default"
              disabled={!this.state.pdf || !this.state.page || this.state.pdf.numPages <= this.state.page}
              onClick={() => this.changePage(this.state.page + 1)}
            >
              <span className="fa fa-fw fa-forward" />
            </button>

            <input
              type="number"
              className="form-control input-sm"
              value={this.state.page}
              onChange={(e) => this.changePage(e.currentTarget.value)}
            />
            {transChoice('count_pages', this.state.pdf ? this.state.pdf.numPages : 0, {count: this.state.pdf ? this.state.pdf.numPages : 0}, 'resource')}
          </div>

          <div className="pdf-zoom">
            <button
              disabled={!this.state.pdf || !this.state.scale}
              className="btn btn-link-default"
              onClick={() => this.zoom(this.state.scale + 25)}
            >
              <span className="fa fa-fw fa-search-plus" />
            </button>
            <button
              className="btn btn-link-default"
              disabled={!this.state.pdf || !this.state.scale || 1 >= this.state.scale}
              onClick={() => this.zoom(this.state.scale - 25)}
            >
              <span className="fa fa-fw fa-search-minus" />
            </button>

            <input
              type="number"
              min="5"
              className="form-control input-sm"
              value={this.state.scale}
              onChange={(e) => this.zoom(e.currentTarget.value)}
            />
            <span className="pdf-zoom-unit">%</span>
          </div>
        </div>
        <div className="pdf-player">
          <canvas id={'pdf-canvas-' + this.props.file.id} className="pdf-player-page" />
        </div>
      </div>
    )
  }
}

PdfPlayer.propTypes = {
  file: T.shape(
    PdfTypes.propTypes
  ).isRequired,
  setErrors: T.func.isRequired
}

export {
  PdfPlayer
}
