
import React, {Component, PropTypes as T} from 'react'
import Tab from 'react-bootstrap/lib/Tab'
import Row from 'react-bootstrap/lib/Row'
import Col from 'react-bootstrap/lib/Col'
import Nav from 'react-bootstrap/lib/Nav'
import NavItem from 'react-bootstrap/lib/NavItem'
import {tex} from './../../utils/translate'
import {Metadata} from './metadata.jsx'

export class PaperTabs extends Component
{
  constructor(props) {
    super(props)
    this.handleSelect = this.handleSelect.bind(this)
  }

  handleSelect(key) {
    if(this.props.onTabChange) {
      this.props.onTabChange(key)
    }
  }

  render() {
    return (
      <div>
        <Metadata title={this.props.item.title} description={this.props.item.description} />
        <Tab.Container id={`${this.props.item.id}-paper`} defaultActiveKey="first">
          <Row className="clearfix">
            <Col sm={12}>
              <Nav bsStyle="tabs">
                <NavItem eventKey="first" onSelect={() => this.handleSelect('first')}>
                  <span className="fa fa-user"></span> {tex('your_answer')}
                </NavItem>
                <NavItem eventKey="second" onSelect={() => this.handleSelect('second')}>
                  <span className="fa fa-check"></span> {tex('expected_answer')}
                </NavItem>
              </Nav>
            </Col>
            <Col sm={12}>
              <Tab.Content animation>
                <Tab.Pane eventKey="first">
                  <div className="panel panel-body">
                    {this.props.yours}
                  </div>
                </Tab.Pane>
                <Tab.Pane eventKey="second">
                  <div className="panel panel-body">
                    {this.props.expected}
                  </div>
                </Tab.Pane>
              </Tab.Content>
            </Col>
          </Row>
        </Tab.Container>
      </div>
    )
  }
}

PaperTabs.propTypes = {
  item: T.shape({
    id: T.string.isRequired,
    title: T.string.isRequired,
    description: T.string.isRequired,
    solutions: T.oneOfType([
      T.arrayOf(T.object),
      T.object
    ]).isRequired
  }),
  answer: T.any.isRequired,
  yours: T.object.isRequired,
  expected: T.object.isRequired,
  onTabChange: T.func
}
