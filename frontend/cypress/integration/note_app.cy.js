describe('Note App', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3000/api/testing/reset');
    const user = {
      name: 'rootUser',
      username: 'root',
      password: 'secretpassword',
    };
    cy.request('POST', 'http://localhost:3000/api/users', user);
    cy.visit('http://localhost:5173');
  });

  it('front page can be opened', function() {
    cy.contains('Notes');
    cy.contains('Note app, Department of Computer Science, University of Helsinki 2022');
  });

  it('login form can be opened', function() {
    cy.contains('login').click();
  });

  it('user can login', function() {
    cy.contains('login').click();
    cy.get('#username').type('root');
    cy.get('#password').type('secretpassword');
    cy.get('#login-button').click();

    cy.contains('rootUser is logged in');
  });

  it('login fails with wrong password', function() {
    cy.contains('login').click();
    cy.get('#username').type('root');
    cy.get('#password').type('wrongpw');
    cy.get('#login-button').click();

    cy.get('.error')
      .should('contain', 'Wrong credentials')
      .and('have.css', 'color', 'rgb(255, 0, 0)')
      .and('have.css', 'border-style', 'solid');

    cy.get('html').should('not.contain', 'rootUser is logged in');
  });

  describe('when logged in', function() {
    beforeEach(function() {
      cy.login({ username: 'root', password: 'secretpassword' });
    });

    it('a new note can be created', function() {
      cy.contains('new note').click();
      cy.get('#add-note').type('a note created by cypress');
      cy.contains('save').click();
      cy.contains('a note created by cypress');
    });

    describe('and a note exists', function() {
      beforeEach(function() {
        cy.createNote({ content: 'first note', important: false });
        cy.createNote({ content: 'second note', important: false });
        cy.createNote({ content: 'third note', important: false });
      });

      it('it can be made important', function() {
        cy.contains('second note').parent().find('button').as('theButton');
        cy.get('@theButton').click();
        cy.get('@theButton').should('contain', 'make not important');
      });
    });
  });
});
