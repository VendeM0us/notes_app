Cypress.Commands.add('login', ({ username, password }) => {
  cy.request('POST', 'http://localhost:3000/api/login', {
    username, password
  }).then(res => {
    localStorage.setItem('loggedNoteappUser', JSON.stringify(res.body));
    cy.visit('http://localhost:5173');
  });
});

Cypress.Commands.add('createNote', ({ content, important }) => {
  cy.request({
    url: 'http://localhost:3000/api/notes',
    method: 'POST',
    body: { content, important },
    headers: {
      'Authorization': `bearer ${JSON.parse(localStorage.getItem('loggedNoteappUser')).token}`
    }
  });

  cy.visit('http://localhost:5173');
});
