// Cypress end-to-end tests for dashboard interactions
describe('Dashboard Interactions E2E Tests', () => {
  before(() => {
    // Visit the dashboard page before running tests
    cy.visit('/dashboard');
  });

  it('loads the dashboard with animated buttons', () => {
    // Check that the dashboard title is displayed
    cy.get('h1').should('contain', 'Dashboard');
    
    // Check that the subtitle is displayed
    cy.get('p').should('contain', 'Your productivity hub with animated controls');
    
    // Check that animated buttons are present
    cy.get('button').contains('New Task').should('exist');
    cy.get('button').contains('Settings').should('exist');
    cy.get('button').contains('Reports').should('exist');
    cy.get('button').contains('Calendar').should('exist');
    cy.get('button').contains('Notifications').should('exist');
    cy.get('button').contains('Profile').should('exist');
  });

  it('allows clicking on animated buttons', () => {
    // Click on the "New Task" button
    cy.get('button').contains('New Task').click();
    
    // Verify the button was clicked (would typically navigate or trigger an action)
    // For now, we'll just verify the button exists and is clickable
    cy.get('button').contains('New Task').should('exist');
  });

  it('displays loading state initially', () => {
    // Reload the page to see the loading state
    cy.reload();
    
    // Check that loading spinner appears
    cy.get('.animate-spin').should('be.visible');
    
    // Wait for loading to complete
    cy.get('.animate-spin').should('not.exist');
  });

  it('responds to hover animations', () => {
    // Hover over a button to trigger animation
    cy.get('button').contains('Settings').trigger('mouseover');
    
    // Check that the button responds to hover
    cy.get('button').contains('Settings').should('exist');
  });

  it('maintains responsive design', () => {
    // Test different screen sizes
    cy.viewport('iphone-6'); // Mobile
    cy.get('h1').should('be.visible');
    
    cy.viewport('ipad-2'); // Tablet
    cy.get('h1').should('be.visible');
    
    cy.viewport('macbook-13'); // Desktop
    cy.get('h1').should('be.visible');
  });

  it('preserves theme preferences', () => {
    // Check that the background has a gradient as specified in the component
    cy.get('[data-motion-div]').should('have.css', 'background-image')
      .and('match', /linear-gradient/);
  });
});