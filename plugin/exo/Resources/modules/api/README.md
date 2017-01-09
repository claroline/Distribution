# API module

## Middleware

The api middleware is highly inspired by:
(Redux real world example)[https://github.com/reactjs/redux/blob/master/examples/real-world/src/middleware/api.js].

It permits to declare new actions that will be caught and transformed in API request.

### Requirements

- Requires to be registered in the app store.
- Requires `redux-thunk` to dispatch the correct sets of actions on AJAX events.
- As it needs `redux-thunk`, the api middleware must to be registered **before** it.

### Usage
Managed action example:

```
import {REQUEST_SEND} from '[path_to_module]/api/actions'

// ...

actions.fetchAttempt = quizId => ({
  [REQUEST_SEND]: {
    route: ['exercise_attempt_start', {exerciseId: quizId}],
    request: {method: 'POST'},
    success: (data) => {
      const normalized = normalize(data)
      return actions.initPlayer(normalized.paper, normalized.answers)
    },
    failure: () => () => navigate('overview') // double fat arrow is needed because navigate is not an action creator
  }
})
```

Action parameters:
- `route (array)`: the route definition of the api endpoint. It's passed to FOSJsRouting to generate the final URL.
 The first param is the route name, the second it's an arguments object.
- `url (string)`: the url to call. If provided, it's used in priority, if not, the middleware will fallback to the `route` param.
- `request (object|Request)`: a custom request to send. See (Fetch)[https://developer.mozilla.org/en-US/docs/Web/API/GlobalFetch/fetch] for more detail..
- `before (func)`: an action to dispatch before sending the request.
- `success (func)`: an action to dispatch when the AJAX request is processed without errors. The received data are passed as func argument.
- `failure (func)`: an action to dispatch if something goes wrong. The error is passed as func argument.

Action only requires a `route` or `url` parameter. All other ones are optional.
If not set in the `request`, the middleware will make `GET` requests by default.

# Enhancements
- The error handler should not only manage HTTP errors.
- The error handler should give access to the detail of the error.
- The middleware should handle offline mode.
