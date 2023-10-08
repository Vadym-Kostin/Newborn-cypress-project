describe("API suite", () => {
    it("Validate the number of categories in the assortment", () => {
        cy.loginByAPI();
        cy.getCategories().then((categories) => {
            cy.contains("Асортимент").click();
            cy.get("a.collection-item").should("have.length", categories.length);
        });
    });
});