// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })


// On ajoute la nouvelle commande globale
Cypress.Commands.add("login", () => {
  cy.visit("/");
  cy.get('[data-cy="login-email-input"]').type("user@test.com");
  cy.get('[data-cy="login-email-input"]').should("have.value", "user@test.com");
  cy.get('[data-cy="login-password-input"]').type("password123");
  cy.get('[data-cy="login-password-input"]').should("have.value", "password123");
  cy.get('[data-cy="login-submit-button"]').should("be.enabled").click();
});