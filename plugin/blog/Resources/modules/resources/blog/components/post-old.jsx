import React from 'react'
import {connect} from 'react-redux'
import {PropTypes as T} from 'prop-types'
import {DataListContainer} from '#/main/core/data/list/containers/data-list.jsx'
import {constants as listConst} from '#/main/core/data/list/constants'
import {HtmlText} from '#/main/core/layout/components/html-text.jsx'
import {displayDate} from '#/main/core/scaffolding/date'
import {t, trans, transChoice} from '#/main/core/translation'
import {UserAvatar} from '#/main/core/user/components/avatar.jsx'
import {TooltipButton} from '#/main/core/layout/button/components/tooltip-button.jsx'

import Panel from 'react-bootstrap/lib/Panel'
import Navbar from 'react-bootstrap/lib/Navbar'
import Nav from 'react-bootstrap/lib/Nav'
import NavItem from 'react-bootstrap/lib/NavItem'
import ButtonGroup from 'react-bootstrap/lib/ButtonGroup'
import Button from 'react-bootstrap/lib/Button'

const Post = props =>
  <div>
    {props.post.id &&
    <article className={!props.post.isPublished ? 'unpublished' : ''}>
      <header>
        <h1><a href={"#/post/" + props.post.slug}>{props.post.title}</a></h1>
          <div className="clearfix">
              <ul className='list-inline post_infos pull-left'>
                <li><UserAvatar className="user_picture" picture={{url:props.post.authorPicture}} alt={false} /> {props.post.author.firstName} {props.post.author.lastName}</li>
                <li><span className="fa fa-calendar"></span> {displayDate(props.post.creationDate, false, true)} </li>
                <li><span className="fa fa-eye"></span> {transChoice('display_views', props.post.viewCounter, {'%count%': props.post.viewCounter}, 'platform')}</li> 
              </ul>
              <ButtonGroup className='pull-right' bsSize="small">
                <Button><span className={!props.post.isPublished ? 'fa-eye-slash fa' : 'fa-eye fa'}></span></Button>
                <Button href={"#/post/" + props.post.slug + "/edit"}><span className="fa fa-edit"></span></Button>
                <Button className="btn-danger"><span className="fa fa-trash-o"></span></Button> 
              </ButtonGroup>
        </div>
      </header>
      <div className='panel-body'>
        <HtmlText>{props.post.content}</HtmlText>
      </div>
      <footer>
        <ul className='list-inline'>
          <li><span className="fa fa-tags"></span></li>
          {props.post.tags && props.post.tags.length > 0 ? (
             props.post.tags && props.post.tags.map(tag =>(
               <PostTag key={tag} tag={tag} />
              ))
            ) : (
              trans('no_tags', {}, 'icap_blog')
            )}
        </ul>
      </footer>
    </article>
    }
  </div>
    
Post.propTypes = {
  post: T.shape({
    id: T.string,
    title: T.string,
    authorPicture: T.string,
    creationDate: T.string,
    author: T.Object,
    viewCounter: T.number,
    isPublished: T.bool
  }),
}

const PostDetail = props =>
<Post key={props.post.id} post={props.post} />

const PostDetailContainer = connect(
  state => ({
    post: state.post
  }),
  dispatch => ({
  })
)(PostDetail)

PostDetail.propTypes = {
  id: T.number,
}

const PostTag = props =>
  <li><a href='#'>{props.tag}</a></li>

PostTag.propTypes = {
  tag: T.string.isRequired,
}

export {Post, PostDetailContainer as FullPost}