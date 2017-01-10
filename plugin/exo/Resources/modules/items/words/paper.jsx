import React, {Component, PropTypes as T} from 'react'
import {tex} from '../../utils/translate'
import Tab from 'react-bootstrap/lib/Tab'
import Row from 'react-bootstrap/lib/Row'
import Col from 'react-bootstrap/lib/Col'
import Nav from 'react-bootstrap/lib/Nav'
import NavItem from 'react-bootstrap/lib/NavItem'
import {Highlight} from './utils/highlight.jsx'
import {Metadata} from '../components/metadata.jsx'

export class WordsPaper extends Component
{
  constructor(props) {
    super(props)
    this.state = {key: 1}
    this.handleSelect = this.handleSelect.bind(this)
  }

  handleSelect(key) {
    this.setState({key})
  }

  render() {
    return (
      <Tab.Container id={`${this.props.item.id}-paper`} defaultActiveKey="first">
        <Row className="clearfix">
          <Col sm={12}>
            <Nav bsStyle="tabs">
              <NavItem eventKey="first">
                  <span className="fa fa-user"></span> {tex('your_answer')}
              </NavItem>
              <NavItem eventKey="second">
                <span className="fa fa-check"></span> {tex('expected_answer')}
              </NavItem>
            </Nav>
          </Col>
          <Col sm={12}>
            <Tab.Content animation>
              <Tab.Pane eventKey="first">
                <Metadata title={this.props.item.title} description={this.props.item.description}/>
                <Highlight
                  text={this.props.answer.data}
                  solutions={this.props.item.solutions}
                  showScore={true}
                />
              </Tab.Pane>
              <Tab.Pane eventKey="second">
                <div>
                  second
                </div>
              </Tab.Pane>
            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>
    )
  }
}

WordsPaper.propTypes = {
  item: T.shape({
    id: T.string.isRequired,
    title: T.string.isRequired,
    description: T.string.isRequired,
    solutions: T.arrayOf(T.object)
  }).isRequired,
  answer: T.object
}
