describe('Distribution View', () => {
  beforeEach(() => {
    cy.mockAPI();
    cy.login();
  });

  it('should display distribution page', () => {
    cy.visit('/distribution');
    cy.contains('Distribution Overview').should('be.visible');
    cy.wait('@getDistribution');
    cy.contains('Distribution Summary').should('be.visible');
  });

  it('should show total items distributed', () => {
    cy.visit('/distribution');
    cy.wait('@getDistribution');
    cy.contains('1').should('be.visible'); // Total items count
    cy.contains('Total Items Distributed').should('be.visible');
  });

  it('should display agent distribution summary', () => {
    cy.visit('/distribution');
    cy.wait('@getDistribution');
    cy.contains('John Doe').should('be.visible');
    cy.contains('1 items').should('be.visible');
  });

  it('should expand accordion to show agent details', () => {
    cy.visit('/distribution');
    cy.wait('@getDistribution');
    
    // Click on accordion header
    cy.contains('John Doe').click();
    
    // Check if table headers are visible
    cy.contains('First Name').should('be.visible');
    cy.contains('Phone').should('be.visible');
    cy.contains('Notes').should('be.visible');
    cy.contains('Assigned Date').should('be.visible');
    
    // Check if data is visible
    cy.contains('Alice').should('be.visible');
    cy.contains('1234567890').should('be.visible');
    cy.contains('Test note').should('be.visible');
  });

  it('should show detailed distribution table', () => {
    cy.visit('/distribution');
    cy.wait('@getDistribution');
    
    cy.contains('John Doe').click();
    
    // Verify table structure
    cy.get('table').should('be.visible');
    cy.get('thead').should('contain', 'First Name');
    cy.get('thead').should('contain', 'Phone');
    cy.get('thead').should('contain', 'Notes');
    cy.get('thead').should('contain', 'Assigned Date');
    
    // Verify data rows
    cy.get('tbody tr').should('have.length', 1);
    cy.get('tbody').should('contain', 'Alice');
  });

  it('should navigate between accordion items', () => {
    cy.visit('/distribution');
    cy.wait('@getDistribution');
    
    // Expand first accordion
    cy.contains('John Doe').click();
    cy.contains('Alice').should('be.visible');
    
    // Collapse by clicking again
    cy.contains('John Doe').click();
    cy.contains('Alice').should('not.be.visible');
  });

  it('should show loading state initially', () => {
    cy.visit('/distribution');
    cy.contains('Loading distribution data...').should('be.visible');
  });
});