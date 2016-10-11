import React, {Component} from 'react'
import OverlayTrigger from 'react-bootstrap/lib/OverlayTrigger'
import Tooltip from 'react-bootstrap/lib/Tooltip'
import {tex} from './../lib/translate'
import {SORT_DETECT} from './../lib/sortable'
import {Thumbnail} from './thumbnail.jsx'

export class ThumbnailBox extends Component {
  constructor(props) {
    super(props)
    // simple transient flag indicating scrolling is needed
    this.state = {addedThumbnail: false}
    this.node = null
  }

  componentDidUpdate() {
    if (this.state.addedThumbnail) {
      this.node.scrollTop = this.node.scrollHeight
      this.node.scrollLeft = this.node.scrollWidth
      this.setState({addedThumbnail: false})
    }
  }

  render() {
    return (
      <div
        className="thumbnail-box scroller"
        ref={node => this.node = node}
      >
        {this.props.thumbnails.map((item, index) =>
          <Thumbnail
            id={item.id}
            key={`${item.type}-${item.id}`}
            index={index}
            title={item.title}
            type={item.type}
            active={item.active}
            onClick={this.props.onThumbnailClick}
            onDeleteClick={this.props.onStepDeleteClick}
            onSort={this.props.onThumbnailMove}
            sortDirection={SORT_DETECT}
            showModal={this.props.showModal}
          />
        )}
        <OverlayTrigger
          placement="bottom"
          overlay={
            <Tooltip id="new-step-tip">{tex('add_step')}</Tooltip>
          }
        >
          <button
            className="btn btn-primary new-step"
            onClick={() => {
              this.props.onNewStepClick()
              this.setState({addedThumbnail: true})
            }}
          >+</button>
        </OverlayTrigger>
      </div>
    )
  }
}

const T = React.PropTypes

ThumbnailBox.propTypes = {
  thumbnails: T.arrayOf(T.object).isRequired,
  onNewStepClick: T.func.isRequired,
  onStepDeleteClick: T.func.isRequired,
  onThumbnailClick: T.func.isRequired,
  onThumbnailMove: T.func.isRequired,
  showModal: T.func.isRequired
}
