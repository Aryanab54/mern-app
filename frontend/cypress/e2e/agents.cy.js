describe('Agents Management', () => {
  beforeEach(() => {
    cy.mockAPI();
    cy.login();
  });

  it('should display agents page', () => {
    cy.visit('/agents');
    cy.contains('Agents Management').should('be.visible');
    cy.contains('Add Agent').should('be.visible');
    cy.wait('@getAgents');
    cy.contains('John Doe').should('be.visible');
  });

  it('should open add agent modal', () => {
    cy.visit('/agents');
    cy.contains('Add Agent').click();
    cy.contains('Add New Agent').should('be.visible');
    cy.get('input[name="name"]').should('be.visible');
    cy.get('input[name="email"]').should('be.visible');
    cy.get('input[name="mobile"]').should('be.visible');
    cy.get('input[name="password"]').should('be.visible');
  });

  it('should validate agent form fields', () => {
    cy.visit('/agents');
    cy.contains('Add Agent').click();
    cy.contains('Create Agent').click();
    
    cy.contains('Name is required').should('be.visible');
    cy.contains('Email is required').should('be.visible');
    cy.contains('Mobile is required').should('be.visible');
    cy.contains('Password is required').should('be.visible');
  });

  it('should validate mobile number format', () => {
    cy.visit('/agents');
    cy.contains('Add Agent').click();
    cy.get('input[name="mobile"]').type('1234567890');
    cy.get('input[name="name"]').click(); // Trigger blur
    cy.contains('Mobile must include country code').should('be.visible');
  });

  it('should create new agent successfully', () => {
    cy.visit('/agents');
    cy.contains('Add Agent').click();
    
    cy.get('input[name="name"]').type('Test Agent');
    cy.get('input[name="email"]').type('test@example.com');
    cy.get('input[name="mobile"]').type('+1234567890');
    cy.get('input[name="password"]').type('password123');
    
    cy.contains('Create Agent').click();
    cy.wait('@createAgent');
    cy.contains('Agent created successfully').should('be.visible');
  });

  it('should close modal on cancel', () => {
    cy.visit('/agents');
    cy.contains('Add Agent').click();
    cy.contains('Cancel').click();
    cy.contains('Add New Agent').should('not.exist');
  });

  it('should display agent statistics', () => {
    cy.visit('/agents');
    cy.wait('@getAgents');
    cy.contains('1 Total').should('be.visible'); // Badge showing total agents
  });
});