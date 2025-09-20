describe('Dashboard', () => {
  beforeEach(() => {
    cy.mockAPI();
    cy.login();
  });

  it('should display dashboard with welcome message', () => {
    cy.visit('/dashboard');
    cy.contains('Welcome back, Admin!').should('be.visible');
    cy.contains('Here\'s what\'s happening').should('be.visible');
  });

  it('should show statistics cards', () => {
    cy.visit('/dashboard');
    cy.wait('@getAgents');
    cy.wait('@getDistribution');
    
    cy.contains('Total Agents').should('be.visible');
    cy.contains('Total Lists').should('be.visible');
    cy.contains('1').should('be.visible'); // Agent count
  });

  it('should display quick action cards', () => {
    cy.visit('/dashboard');
    
    cy.contains('Manage Agents').should('be.visible');
    cy.contains('Upload Lists').should('be.visible');
    cy.contains('View Distribution').should('be.visible');
    
    cy.contains('Go to Agents').should('be.visible');
    cy.contains('Upload Files').should('be.visible');
    cy.contains('View Lists').should('be.visible');
  });

  it('should navigate to agents page', () => {
    cy.visit('/dashboard');
    cy.contains('Go to Agents').click();
    cy.url().should('include', '/agents');
    cy.contains('Agents Management').should('be.visible');
  });

  it('should navigate to upload page', () => {
    cy.visit('/dashboard');
    cy.contains('Upload Files').click();
    cy.url().should('include', '/upload');
    cy.contains('Upload & Distribute').should('be.visible');
  });

  it('should navigate to distribution page', () => {
    cy.visit('/dashboard');
    cy.contains('View Lists').click();
    cy.url().should('include', '/distribution');
    cy.contains('Distribution Overview').should('be.visible');
  });

  it('should show proper card descriptions', () => {
    cy.visit('/dashboard');
    
    cy.contains('Add new agents and manage existing ones').should('be.visible');
    cy.contains('Upload CSV files and distribute to agents').should('be.visible');
    cy.contains('Monitor distributed lists and assignments').should('be.visible');
  });

  it('should display navigation breadcrumbs', () => {
    cy.visit('/dashboard');
    cy.get('.navbar').should('be.visible');
    cy.contains('MERN Admin').should('be.visible');
  });
});