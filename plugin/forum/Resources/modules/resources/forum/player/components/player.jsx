import React from 'react'
import {Post} from '#/plugin/forum/resources/forum/player/components/post'

const tags = [
  'tag2',
  'tag3',
  'tag4'
]


const Player = (props) =>
  <div>
    <h2>Titre du Sujet <small>5 messages</small></h2>
    <div className="tag">
      <ul>
        {tags.map(tag =><li key={tag}>{tag}</li>)}
      </ul>
    </div>
    <section className="posts">
      <Post/>
      <Post/>
      <Post/>
    </section>
  </div>

export {
  Player
}
