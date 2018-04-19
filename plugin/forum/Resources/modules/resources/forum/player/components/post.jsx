import React from 'react'

import {Button} from '#/main/app/action/components/button'

const Post = () =>
  <div className="post row">

    <div className="post-user col-md-2">
      IMG
    </div>

    <div className="post-content col-md-10">
      <div className="post-info">
        <div>User name</div>
        <div>Post date</div>
      </div>
      <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Itaque rem ex ea. Quis, architecto. Ad praesentium similique nostrum tempora voluptatum quaerat facere aut, at repudiandae magni. Error consectetur nulla quas.</p>
      <Button
        label="Answer"
        type="url"
        className="btn"
      />
    </div>
  </div>

export {
  Post
}
