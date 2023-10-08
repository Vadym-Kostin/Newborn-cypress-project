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

Cypress.Commands.add("getToken", () => {
    return cy.request("POST", "/api/auth/login", {
        email: Cypress.env("email"),
        password: Cypress.env("password")
    }).then((result) => {
        return result.body.token;
    });
});

Cypress.Commands.add("loginByAPI", () => {
    cy.getToken().then((token) => {
        cy.visit("/overview", {
            onBeforeLoad(win) {
                win.localStorage.setItem("auth-token", token);
            }
        });
    });
});

Cypress.Commands.add("getCategories", () => {
    return cy.getToken().then((token) => {
        return cy.request({
            method: "GET",
            url: "/api/category",
            headers: {
                Authorization: token
            }
        }).its("body").then((body) => {
            return body;
        });
    });
});