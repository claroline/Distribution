import {PropTypes as T} from 'prop-types'

const Parameters = {
  propTypes: {
    disable_certificates: T.bool.isRequired,
    disable_invitations: T.bool.isRequired,
    disable_session_event_registration: T.bool.isRequired,
    display_user_events_in_desktop_agenda: T.bool.isRequired,
    enable_courses_profile_tab: T.bool.isRequired,
    enable_ws_in_courses_profile_tab: T.bool.isRequired,
    session_default_duration: T.number,
    session_default_total: T.number
  }
}

export {
  Parameters
}