import {bootstrap} from '#/main/app/bootstrap'

import {LessonResource} from '#/plugin/lesson/resources/lesson/components/resource.jsx'

import {reducer} from '#/plugin/lesson/resources/lesson/store'


// mount the react application
bootstrap(
  // app DOM container (also holds initial app data as data attributes)
  '.lesson-container',

  // app main component
  LessonResource,

  // app store configuration
  reducer,

  // transform data attributes for redux store
  (initialData) => {
    return {
      lesson: initialData.lesson,
      currentChapter: initialData.chapter,
      resourceNode: initialData.resourceNode
    }
  }
)