import {QUESTION_CURRENT, SAVE_CORRECTION_ENABLE, SCORE_UPDATE} from './actions'

function testQuestions() {
  return [
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
}

function testAnswers() {
  return [
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
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus orci neque, aliquam eu lobortis non, fringilla nec nisi.
        Curabitur fermentum posuere eros a cursus. Proin eu lorem sed massa tempus fringilla. Phasellus facilisis tellus id ante elementum,
        id blandit nibh fringilla. Sed posuere dolor at dictum laoreet. Curabitur tortor dui, suscipit a turpis et, congue porta erat.
        Phasellus quis lacinia eros, quis eleifend mauris. Morbi vel consectetur nulla. Fusce purus odio, sollicitudin sed auctor a, sollicitudin sed odio.
        Nam dui arcu, semper sed eros quis, sollicitudin vestibulum eros. Phasellus semper ac velit sit amet pellentesque. Phasellus ut faucibus nibh, a iaculis orci.</p>
        <p>Mauris pulvinar nec eros et tristique. Aenean eget nisl vitae dui laoreet mattis ac sed arcu. Class aptent taciti sociosqu ad litora torquent per conubia nostra,
        per inceptos himenaeos. Ut vitae eleifend est, nec auctor leo. Fusce pretium arcu vel nibh laoreet, eu convallis metus posuere. Morbi luctus posuere odio,
        eu egestas enim luctus blandit. Mauris tincidunt accumsan leo, nec sagittis urna laoreet eu. Cras congue ac quam id elementum.</p>
      `
    },
    {
      id: '3',
      questionId: '1',
      score: null,
      type: 'text/html',
      data: `
        <p>Vivamus interdum nisl id nulla viverra pharetra. Donec quis aliquet risus. Aenean suscipit placerat tempus. Curabitur nunc orci,
        laoreet eu libero quis, egestas suscipit justo. Aliquam erat volutpat. Curabitur commodo sodales convallis.
        Maecenas blandit lorem nec arcu pharetra, id placerat massa vehicula. Donec ut nibh in nulla egestas pharetra.
        Nam eu magna at nunc fringilla finibus ut lobortis eros. Maecenas a lacinia erat.</p>
        <p>Donec semper porta est, a interdum erat consectetur sit amet. Integer consequat in libero non lobortis.
        Donec non erat et sem pellentesque rutrum. In quis eros est. Ut ornare iaculis justo nec tristique. Nam leo eros, luctus eu lacinia in, sollicitudin in arcu.
        Integer lacus est, faucibus sed arcu convallis, finibus varius nisl. Maecenas urna nulla, condimentum a enim sit amet, mattis semper quam.</p>
      `
    },
    {
      id: '4',
      questionId: '2',
      score: null,
      type: 'text/html',
      data: `
        <p>Fusce sed feugiat sapien. Suspendisse dictum imperdiet mi, sit amet aliquet leo eleifend id. Quisque eu turpis tempus, feugiat nibh eget, dignissim neque.
        Aliquam eu turpis eu tellus lacinia euismod. Ut pretium dolor vel erat viverra, ut elementum odio iaculis.
        Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Vestibulum at velit blandit, sagittis quam ac, luctus quam.
        Quisque felis ex, egestas nec turpis id, tincidunt porttitor urna. Interdum et malesuada fames ac ante ipsum primis in faucibus.
        Nullam faucibus tortor euismod velit maximus, at consectetur ex maximus. Nunc at erat at ex porttitor maximus sed in turpis.
        Fusce eget urna sed nisi faucibus fringilla id posuere diam.</p>
      `
    },
    {
      id: '9',
      questionId: '2',
      type: 'text/html',
      data: `
        <p>Oui</p>
      `
    }
  ]
}

function initialQuestionId() {
  return null
}

function reduceCurrentQuestion(currentQuestionId = initialQuestionId(), action = {}) {
  switch (action.type) {
    case QUESTION_CURRENT: {
      return action.id
    }
  }
  return currentQuestionId
}

function reduceQuestions(questions = testQuestions(), action = {}) {
  return questions
}

function reduceAnswers(answers = testAnswers(), action = {}) {
  switch (action.type) {
    case SCORE_UPDATE: {
      return answers.map((answer, index) => {
        if (answer.id === action.answerId) {
          return Object.assign({}, answer, {score: parseFloat(action.score)})
        } else {
          return answer
        }
      })
    }
  }
  return answers
}

export const reducers = {
  answers: reduceAnswers,
  questions: reduceQuestions,
  currentQuestion: reduceCurrentQuestion
}