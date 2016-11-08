function goodbyeWorld () {
  console.error('good bye world !')
}

module.exports = {
  administration: {
    users: {
      buttons: [
        {
          name: 'tag',
          href: 'path/to/tag',
          icon: 'ahah/je/suis/tag',
          callback: goodbyeWorld
        }
      ]
    }
  }
}
