describe('My First Test', () => {
  it('Visits the initial project page', () => {
    cy.visit('/')
    cy.contains('TI Wizard')
    cy.contains('Wizard')
    cy.contains('Settings')
    cy.contains('About')
    cy.contains('Select TI Directory')
  })
})
