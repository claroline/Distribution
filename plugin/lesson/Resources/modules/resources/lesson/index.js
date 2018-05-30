import {bootstrap} from '#/main/app/bootstrap'
import {registerModals} from '#/main/core/layout/modal'
import {registerType} from '#/main/core/data'
import {FIELDS_TYPE, fieldsDefinition} from '#/main/core/data/types/fields'

import {LessonResource} from '#/plugin/lesson/resources/lesson/components/resource.jsx'

import {reducer} from '#/plugin/lesson/resources/lesson/reducer'


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