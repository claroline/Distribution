import {PropTypes as T} from 'prop-types'

const Profile = {
  propTypes: {
    user: T.shape({

    }).isRequired,
    facets: T.arrayOf(T.shape({
      id: T.string.isRequired,
      title: T.string.isRequired
    })),
    openFacet: T.func.isRequired
  }
}

export {
  Profile
}