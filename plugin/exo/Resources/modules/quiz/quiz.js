import React from 'react'
import ReactDOM from 'react-dom'
import {Provider} from 'react-redux'
import {DragDropContext} from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import {Quiz as QuizComponent} from './components/quiz.jsx'
import {normalize} from './normalizer'
import {decorate} from './decorators'
import {createStore} from './store'
import {makeRouter} from './router'
import {makeSaveGuard} from './editor/save-guard'
import {registerDefaultItemTypes, getDecorators} from './../items/item-types'
import {registerModalType} from './../modal'
import {MODAL_ADD_ITEM, AddItemModal} from './editor/components/add-item-modal.jsx'
import {MODAL_IMPORT_ITEMS, ImportItemsModal} from './editor/components/import-items-modal.jsx'

import './editor/style.css'

export class Quiz {
  constructor(rawQuizData, noServer = false) {
    const questions = [
      {
        id: '1',
        type: 'application/x.open+json',
        title: 'Question ouverte #1',
        content: '<p>Qui êtes-vous ?</p>',
        contentType: 'text',
        score: {
          type: 'manual',
          max: 12
        }
      },
      {
        id: '2',
        type: 'application/x.open+json',
        title: 'Question ouverte #2',
        content: '<p>Qui faîtes-vous ?</p>',
        contentType: 'text',
        score: {
          type: 'manual',
          max: 20
        }
      }
    ]
    const openAnswers = [
      {
        id: '1',
        questionId: '1',
        type: 'text/html',
        data: `
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse quis ultrices metus. Suspendisse id ligula ut augue suscipit commodo in lacinia dui.
          Maecenas a lacinia nunc. Aliquam dapibus porttitor orci, sed posuere odio rhoncus in. Sed lectus mi, vehicula at nisi quis, consequat egestas purus.
          Maecenas id dignissim enim. Praesent ac massa quis dui volutpat porta. Suspendisse tristique mi velit, et pharetra tellus sollicitudin ac.
          Aenean massa nisl, mollis et posuere id, rutrum non ante. Pellentesque non dolor magna. Curabitur varius pretium aliquet. Nullam fermentum eget metus sit amet varius.</p>
          <p>Aenean vel turpis aliquam sapien facilisis pretium. Phasellus vitae mauris sed enim tempor mollis in at ipsum. Vivamus vitae accumsan arcu.
          Nullam rhoncus, massa id aliquam ullamcorper, neque ex feugiat lacus, ut tristique leo ante vulputate arcu. Mauris gravida accumsan dolor ut fringilla.
          Proin et diam in nisi placerat mattis. Pellentesque ut quam vehicula, feugiat turpis hendrerit, egestas lacus.
          Suspendisse vulputate dui quis ante consequat ullamcorper. Donec elit lectus, vehicula at odio nec, volutpat vulputate nisi.
          Nunc odio dolor, pulvinar et sagittis in, lacinia sit amet metus.</p>
          <p>Pellentesque sed euismod felis. Nulla ac condimentum erat. In hac habitasse platea dictumst. Suspendisse eget scelerisque libero.
          Sed rutrum arcu quis diam volutpat, eget tristique dui convallis. Aenean a urna commodo, hendrerit dui in, consectetur elit. Morbi eget diam sit amet metus maximus tristique.</p>
          <p>In rhoncus pretium sem. Praesent et egestas sapien. Maecenas maximus augue vel justo pretium efficitur.
          Mauris vel lectus mollis, tincidunt elit in, pulvinar tortor. Suspendisse potenti. Nunc a velit ut magna finibus placerat.
          Praesent quis euismod urna, a laoreet ex. Ut eu nibh elementum, egestas ex vitae, feugiat tortor. Sed dui urna, lacinia quis porta ut, iaculis a libero.</p>
          <p>Proin id urna at arcu condimentum iaculis. Suspendisse nec erat leo. Donec sit amet aliquet ipsum. Nulla elementum tristique velit vitae ultricies.
          Nam augue ligula, facilisis et magna at, ullamcorper sodales orci. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.
          Aliquam vel est ut ex convallis feugiat. Integer gravida purus non tortor euismod egestas. Etiam vitae vehicula lacus.
          Sed aliquam, elit vitae mollis commodo, velit ligula eleifend urna, suscipit lacinia quam lorem et erat.
          Nullam urna massa, congue commodo magna at, luctus facilisis lectus. Nam lobortis leo molestie turpis eleifend fermentum.
          Fusce interdum leo felis, at ornare arcu rutrum at. Aliquam sodales nisi sit amet metus semper, sed tempus tortor pulvinar. Fusce ornare quis neque non eleifend.</p>
        `
      },
      {
        id: '2',
        questionId: '1',
        type: 'text/html',
        data: `
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse quis ultrices metus. Suspendisse id ligula ut augue suscipit commodo in lacinia dui.
          Maecenas a lacinia nunc. Aliquam dapibus porttitor orci, sed posuere odio rhoncus in. Sed lectus mi, vehicula at nisi quis, consequat egestas purus.
          Maecenas id dignissim enim. Praesent ac massa quis dui volutpat porta. Suspendisse tristique mi velit, et pharetra tellus sollicitudin ac.
          Aenean massa nisl, mollis et posuere id, rutrum non ante. Pellentesque non dolor magna. Curabitur varius pretium aliquet. Nullam fermentum eget metus sit amet varius.</p>
          <p>Aenean vel turpis aliquam sapien facilisis pretium. Phasellus vitae mauris sed enim tempor mollis in at ipsum. Vivamus vitae accumsan arcu.
          Nullam rhoncus, massa id aliquam ullamcorper, neque ex feugiat lacus, ut tristique leo ante vulputate arcu. Mauris gravida accumsan dolor ut fringilla.
          Proin et diam in nisi placerat mattis. Pellentesque ut quam vehicula, feugiat turpis hendrerit, egestas lacus.
          Suspendisse vulputate dui quis ante consequat ullamcorper. Donec elit lectus, vehicula at odio nec, volutpat vulputate nisi.
          Nunc odio dolor, pulvinar et sagittis in, lacinia sit amet metus.</p>
          <p>Pellentesque sed euismod felis. Nulla ac condimentum erat. In hac habitasse platea dictumst. Suspendisse eget scelerisque libero.
          Sed rutrum arcu quis diam volutpat, eget tristique dui convallis. Aenean a urna commodo, hendrerit dui in, consectetur elit. Morbi eget diam sit amet metus maximus tristique.</p>
          <p>In rhoncus pretium sem. Praesent et egestas sapien. Maecenas maximus augue vel justo pretium efficitur.
          Mauris vel lectus mollis, tincidunt elit in, pulvinar tortor. Suspendisse potenti. Nunc a velit ut magna finibus placerat.
          Praesent quis euismod urna, a laoreet ex. Ut eu nibh elementum, egestas ex vitae, feugiat tortor. Sed dui urna, lacinia quis porta ut, iaculis a libero.</p>
          <p>Proin id urna at arcu condimentum iaculis. Suspendisse nec erat leo. Donec sit amet aliquet ipsum. Nulla elementum tristique velit vitae ultricies.
          Nam augue ligula, facilisis et magna at, ullamcorper sodales orci. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.
          Aliquam vel est ut ex convallis feugiat. Integer gravida purus non tortor euismod egestas. Etiam vitae vehicula lacus.
          Sed aliquam, elit vitae mollis commodo, velit ligula eleifend urna, suscipit lacinia quam lorem et erat.
          Nullam urna massa, congue commodo magna at, luctus facilisis lectus. Nam lobortis leo molestie turpis eleifend fermentum.
          Fusce interdum leo felis, at ornare arcu rutrum at. Aliquam sodales nisi sit amet metus semper, sed tempus tortor pulvinar. Fusce ornare quis neque non eleifend.</p>
        `
      },
      {
        id: '3',
        questionId: '1',
        score: 10,
        type: 'text/html',
        data: `
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse quis ultrices metus. Suspendisse id ligula ut augue suscipit commodo in lacinia dui.
          Maecenas a lacinia nunc. Aliquam dapibus porttitor orci, sed posuere odio rhoncus in. Sed lectus mi, vehicula at nisi quis, consequat egestas purus.
          Maecenas id dignissim enim. Praesent ac massa quis dui volutpat porta. Suspendisse tristique mi velit, et pharetra tellus sollicitudin ac.
          Aenean massa nisl, mollis et posuere id, rutrum non ante. Pellentesque non dolor magna. Curabitur varius pretium aliquet. Nullam fermentum eget metus sit amet varius.</p>
          <p>Aenean vel turpis aliquam sapien facilisis pretium. Phasellus vitae mauris sed enim tempor mollis in at ipsum. Vivamus vitae accumsan arcu.
          Nullam rhoncus, massa id aliquam ullamcorper, neque ex feugiat lacus, ut tristique leo ante vulputate arcu. Mauris gravida accumsan dolor ut fringilla.
          Proin et diam in nisi placerat mattis. Pellentesque ut quam vehicula, feugiat turpis hendrerit, egestas lacus.
          Suspendisse vulputate dui quis ante consequat ullamcorper. Donec elit lectus, vehicula at odio nec, volutpat vulputate nisi.
          Nunc odio dolor, pulvinar et sagittis in, lacinia sit amet metus.</p>
          <p>Pellentesque sed euismod felis. Nulla ac condimentum erat. In hac habitasse platea dictumst. Suspendisse eget scelerisque libero.
          Sed rutrum arcu quis diam volutpat, eget tristique dui convallis. Aenean a urna commodo, hendrerit dui in, consectetur elit. Morbi eget diam sit amet metus maximus tristique.</p>
          <p>In rhoncus pretium sem. Praesent et egestas sapien. Maecenas maximus augue vel justo pretium efficitur.
          Mauris vel lectus mollis, tincidunt elit in, pulvinar tortor. Suspendisse potenti. Nunc a velit ut magna finibus placerat.
          Praesent quis euismod urna, a laoreet ex. Ut eu nibh elementum, egestas ex vitae, feugiat tortor. Sed dui urna, lacinia quis porta ut, iaculis a libero.</p>
          <p>Proin id urna at arcu condimentum iaculis. Suspendisse nec erat leo. Donec sit amet aliquet ipsum. Nulla elementum tristique velit vitae ultricies.
          Nam augue ligula, facilisis et magna at, ullamcorper sodales orci. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.
          Aliquam vel est ut ex convallis feugiat. Integer gravida purus non tortor euismod egestas. Etiam vitae vehicula lacus.
          Sed aliquam, elit vitae mollis commodo, velit ligula eleifend urna, suscipit lacinia quam lorem et erat.
          Nullam urna massa, congue commodo magna at, luctus facilisis lectus. Nam lobortis leo molestie turpis eleifend fermentum.
          Fusce interdum leo felis, at ornare arcu rutrum at. Aliquam sodales nisi sit amet metus semper, sed tempus tortor pulvinar. Fusce ornare quis neque non eleifend.</p>
        `
      },
      {
        id: '4',
        questionId: '2',
        score: null,
        type: 'text/html',
        data: `
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse quis ultrices metus. Suspendisse id ligula ut augue suscipit commodo in lacinia dui.
          Maecenas a lacinia nunc. Aliquam dapibus porttitor orci, sed posuere odio rhoncus in. Sed lectus mi, vehicula at nisi quis, consequat egestas purus.
          Maecenas id dignissim enim. Praesent ac massa quis dui volutpat porta. Suspendisse tristique mi velit, et pharetra tellus sollicitudin ac.
          Aenean massa nisl, mollis et posuere id, rutrum non ante. Pellentesque non dolor magna. Curabitur varius pretium aliquet. Nullam fermentum eget metus sit amet varius.</p>
          <p>Aenean vel turpis aliquam sapien facilisis pretium. Phasellus vitae mauris sed enim tempor mollis in at ipsum. Vivamus vitae accumsan arcu.
          Nullam rhoncus, massa id aliquam ullamcorper, neque ex feugiat lacus, ut tristique leo ante vulputate arcu. Mauris gravida accumsan dolor ut fringilla.
          Proin et diam in nisi placerat mattis. Pellentesque ut quam vehicula, feugiat turpis hendrerit, egestas lacus.
          Suspendisse vulputate dui quis ante consequat ullamcorper. Donec elit lectus, vehicula at odio nec, volutpat vulputate nisi.
          Nunc odio dolor, pulvinar et sagittis in, lacinia sit amet metus.</p>
          <p>Pellentesque sed euismod felis. Nulla ac condimentum erat. In hac habitasse platea dictumst. Suspendisse eget scelerisque libero.
          Sed rutrum arcu quis diam volutpat, eget tristique dui convallis. Aenean a urna commodo, hendrerit dui in, consectetur elit. Morbi eget diam sit amet metus maximus tristique.</p>
          <p>In rhoncus pretium sem. Praesent et egestas sapien. Maecenas maximus augue vel justo pretium efficitur.
          Mauris vel lectus mollis, tincidunt elit in, pulvinar tortor. Suspendisse potenti. Nunc a velit ut magna finibus placerat.
          Praesent quis euismod urna, a laoreet ex. Ut eu nibh elementum, egestas ex vitae, feugiat tortor. Sed dui urna, lacinia quis porta ut, iaculis a libero.</p>
          <p>Proin id urna at arcu condimentum iaculis. Suspendisse nec erat leo. Donec sit amet aliquet ipsum. Nulla elementum tristique velit vitae ultricies.
          Nam augue ligula, facilisis et magna at, ullamcorper sodales orci. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.
          Aliquam vel est ut ex convallis feugiat. Integer gravida purus non tortor euismod egestas. Etiam vitae vehicula lacus.
          Sed aliquam, elit vitae mollis commodo, velit ligula eleifend urna, suscipit lacinia quam lorem et erat.
          Nullam urna massa, congue commodo magna at, luctus facilisis lectus. Nam lobortis leo molestie turpis eleifend fermentum.
          Fusce interdum leo felis, at ornare arcu rutrum at. Aliquam sodales nisi sit amet metus semper, sed tempus tortor pulvinar. Fusce ornare quis neque non eleifend.</p>
        `
      }
    ]
    registerDefaultItemTypes()
    registerModalType(MODAL_ADD_ITEM, AddItemModal)
    registerModalType(MODAL_IMPORT_ITEMS, ImportItemsModal)
    const quizData = decorate(normalize(rawQuizData), getDecorators())
    this.store = createStore(Object.assign({noServer: noServer, questions: questions, openAnswers: openAnswers}, quizData))
    this.dndQuiz = DragDropContext(HTML5Backend)(QuizComponent)
    makeRouter(this.store.dispatch.bind(this.store))
    makeSaveGuard(this.store.getState.bind(this.store))
  }

  render(element) {
    ReactDOM.render(
      React.createElement(
        Provider,
        {store: this.store},
        React.createElement(this.dndQuiz)
      ),
      element
    )
  }
}
