function helloWorld() {
    console.error('hello world !')
}

module.exports = {
  administration: {
    users: {
      buttons: [
        {
          name: 'cursus',
          href: 'path/to/cursus',
          icon: 'ahah/je/suis/cursus',
          callback: helloWorld
        }
      ]
    }
  }
}
