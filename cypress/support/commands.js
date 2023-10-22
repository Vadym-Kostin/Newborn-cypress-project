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
        cy.intercept("GET", "/api/analytics/overview").as("overview");
        cy.visit("/overview", {
            onBeforeLoad(win) {
                win.localStorage.setItem("auth-token", token);
            }
        });
        cy.wait("@overview", {timeout: 7000}).its("response.statusCode").then((statusCode) => {
            if (statusCode === 200) {
                cy.log("Response status code is 200");
            } else if (statusCode === 304) {
                cy.log("Response status code is 304");
            } else {
                cy.log(`Response status code: ${statusCode}`);
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

Cypress.Commands.add("createPositions", () => {
    cy.intercept("POST", "/api/category").as("createdCategory");
    return cy.getToken().then((token) => {
        cy.contains("button", "Зберегти зміни").click();
        return cy.wait("@createdCategory").its("response.body._id").then((id) => {
            Cypress.env("categoryID", id);
            cy.request({
                method: "POST",
                url: "/api/position",
                body: {
                    category: id,
                    cost: 100,
                    name: "Position 1"
                },
                headers: {
                    Authorization: token
                }
            });
            
            cy.request({
                method: "POST",
                url: "/api/position",
                body: {
                    category: id,
                    cost: 250,
                    name: "Position 2"
                },
                headers: {
                    Authorization: token
                }
            });

            cy.request({
                method: "POST",
                url: "/api/position",
                body: {
                    category: id,
                    cost: 300,
                    name: "Position 3"
                },
                headers: {
                    Authorization: token
                }
            });
        });
    });
});

Cypress.Commands.add("createOrder", () => {
    cy.intercept("POST", "/api/order").as("createdOrder");
    cy.contains("button", "Підтвердити").click();
    return cy.wait("@createdOrder").its("response.body.order").then((order) => {
        return order;
    });
});

Cypress.Commands.add("filterOrderByID", () => {
    return cy.createOrder().then((orderNumber) => {
        return cy.getToken().then((token) => {
            return cy.request({
                method: "GET",
                url: `/api/order?order=${orderNumber}`,
                headers: {
                    Authorization: token
                }
            }).its("body.length").should("eq", 1);
        });
    });
});

Cypress.Commands.add("validateCategoryPresenceInDB", () => {
    const categoryID = Cypress.env("categoryID");
    cy.findOne({_id: categoryID}, {collection: "categories"}).then((category) => {
        if (category) {
            cy.log("The category is still in DB");
        } else {
            cy.log("The category is successfully deleted from DB");
        }
    });
});