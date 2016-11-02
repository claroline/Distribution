import React, {Component, PropTypes as T} from 'react'
import classes from 'classnames'
import {tex} from './../../lib/translate'

// see https://github.com/lovasoa/react-contenteditable
class ContentEditable extends Component {
  constructor() {
    super()
    this.emitChange = this.emitChange.bind(this)
  }

  render() {
    return (
      <div
        id={this.props.id}
        ref={el => this.el = el}
        onInput={this.emitChange}
        onBlur={this.emitChange}
        dangerouslySetInnerHTML={{__html: this.props.content}}
        contentEditable={true}
        title={this.props.title}
        role="textbox"
        className="form-control"
        aria-multiline={true}
        style={{minHeight: `${this.props.minRows * 32}px`}}
      />
    )
  }

  shouldComponentUpdate(nextProps) {
    return (
      !this.el
      || (nextProps.content !== this.el.innerHTML
        && nextProps.content !== this.props.content)
    )
  }

  componentDidUpdate() {
    if (this.el && this.props.content !== this.el.innerHTML) {
      this.el.innerHTML = this.props.content
    }
  }

  emitChange() {
    if (!this.el) {
      return
    }

    const content = this.el.innerHTML

    if (this.props.onChange && content !== this.lastContent) {
      this.props.onChange(content)
    }

    this.lastContent = content
  }
}

ContentEditable.propTypes = {
  id: T.string.isRequired,
  minRows: T.number.isRequired,
  content: T.string.isRequired,
  onChange: T.func.isRequired,
  title: T.string
}

class Tinymce extends Component {
  constructor(props) {
    super(props)
    this.editor = null
  }

  componentDidMount() {
    const interval = setInterval(() => {
      const editor = window.tinymce.get(this.props.id)

      if (editor) {
        this.editor = editor
        this.editor.on('change', e => {
          this.props.onChange(e.target.getContent())
        })
        clearInterval(interval)
      }
    }, 100)
  }

  componentWillReceiveProps(nextProps) {
    this.editor.setContent(nextProps.content)
  }

  componentWillUnmount() {
    this.editor.destroy()
  }

  render() {
    return (
      <textarea
        id={this.props.id}
        title={this.props.title}
        className="form-control claroline-tiny-mce hide"
        defaultValue={this.props.content}
      />
    )
  }
}

Tinymce.propTypes = {
  id: T.string.isRequired,
  content: T.string.isRequired,
  onChange: T.func.isRequired,
  title: T.string
}

export class Textarea extends Component {
  constructor(props) {
    super(props)
    this.state = {minimal: true}
  }

  makeMinimalEditor() {
    return (
      <ContentEditable
        id={this.props.id}
        title={this.props.title}
        minRows={this.props.minRows}
        content={this.props.content}
        onChange={this.props.onChange}
      />
    )
  }

  makeFullEditor() {
    return (
      <Tinymce
        id={this.props.id}
        title={this.props.title}
        content={this.props.content}
        onChange={this.props.onChange}
      />
    )
  }

  render() {
    return (
      <div className={classes('text-editor', {'minimal': this.state.minimal === true})}>
        <span
          role="button"
          title={tex(this.state.minimal ? 'rich_text_tools' : 'minimize')}
          className={classes(
            'toolbar-toggle',
            'fa',
            this.state.minimal ? 'fa-plus-circle' : 'fa-minus-circle'
          )}
          onClick={() => this.setState({minimal: !this.state.minimal})}
        />
        {this.state.minimal ?
          this.makeMinimalEditor() :
          this.makeFullEditor()
        }
      </div>
    )
  }
}

Textarea.propTypes = {
  id: T.string.isRequired,
  minRows: T.number,
  title: T.string,
  content: T.string.isRequired,
  onChange: T.func.isRequired
}

Textarea.defaultProps = {
  minRows: 2
}
