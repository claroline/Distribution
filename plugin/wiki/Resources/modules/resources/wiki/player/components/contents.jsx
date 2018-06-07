import React from 'react'
import {trans} from '#/main/core/translation'
import {PropTypes as T} from 'prop-types'

const ContentSection = props =>
  <div className="wiki-contents-section">
    <div className="wiki-contents-section-title">
      {props.num && Array.isArray(props.num) && <span className="ordering">{props.num.join('.')} - </span>}
      <span className="name">{props.section.activeContribution.title}</span>
    </div>
    {
      props.section.children &&
      props.section.children.map(
        (section, index) => <ContentSection
          section={section}
          key={section.id}
          num={props.num.push(index + 1)}
        />
      )
    }
  </div>

ContentSection.propTypes = {
  section: T.object.isRequired,
  num: T.arrayOf(T.number).isRequired
}

const Contents = props =>
  <div className="wiki-contents">
    <h5 className="wiki-contents-title">{trans('wiki_contents', {}, 'icap_wiki')}</h5>
    <div className="wiki-contents-inner">
      {
        props.sectionTree.children &&
        props.sectionTree.children.map(
          (section, index) => <ContentSection
            section={section}
            key={section.id}
            num={[index + 1]}
          />
        )
      }
    </div>
  </div>

Contents.propTypes = {
  sectionTree: T.object.isRequired
}

export {
  Contents
}