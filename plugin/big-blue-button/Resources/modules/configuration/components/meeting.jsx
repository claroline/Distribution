import React from 'react'
import {PropTypes as T} from 'prop-types'

export const Meeting = props =>
  <div className="bbb-meeting">
    Meeting
  </div>

Meeting.propTypes = {
  meeting: T.shape({
    meetingID: T.string.isRequired,
    meetingName: T.string,
    createTime: T.string,
    createDate: T.string,
    attendeePW: T.string,
    moderatorPW: T.string,
    hasBeenForciblyEnded: T.string,
    running: T.string,
    participantCount: T.string,
    listenerCount: T.string,
    voiceParticipantCount: T.string,
    videoCount: T.string,
    duration: T.string,
    hasUserJoined: T.string
  }).isRequired
}
