describe('Navigation', () => {
  beforeEach(() => {
    cy.mockAPI();
    cy.login();
  });

  it('should display navigation bar when logged in', () => {
    cy.visit('/dashboard');
    cy.get('.navbar').should('be.visible');
    cy.contains('MERN Admin').should('be.visible');
    cy.contains('Dashboard').should('be.visible');
    cy.contains('Agents').should('be.visible');
    cy.contains('Upload').should('be.visible');
    cy.contains('Distribution').should('be.visible');
  });

  it('should highlight active navigation item', () => {
    cy.visit('/dashboard');
    cy.get('a[href="/dashboard"]').should('have.class', 'text-primary');
    
    cy.visit('/agents');
    cy.get('a[href="/agents"]').should('have.class', 'text-primary');
    
    cy.visit('/upload');
    cy.get('a[href="/upload"]').should('have.class', 'text-primary');
    
    cy.visit('/distribution');
    cy.get('a[href="/distribution"]').should('have.class', 'text-primary');
  });

  it('should navigate between pages using navbar', () => {
    cy.visit('/dashboard');
    
    // Navigate to Agents
    cy.get('a[href="/agents"]').click();
    cy.url().should('include', '/agents');
    cy.contains('Agents Management').should('be.visible');
    
    // Navigate to Upload
    cy.get('a[href="/upload"]').click();
    cy.url().should('include', '/upload');
    cy.contains('Upload & Distribute').should('be.visible');
    
    // Navigate to Distribution
    cy.get('a[href="/distribution"]').click();
    cy.url().should('include', '/distribution');
    cy.contains('Distribution Overview').should('be.visible');
    
    // Navigate back to Dashboard
    cy.get('a[href="/dashboard"]').click();
    cy.url().should('include', '/dashboard');
    cy.contains('Welcome back, Admin!').should('be.visible');
  });

  it('should show user dropdown menu', () => {
    cy.visit('/dashboard');
    cy.get('[data-bs-toggle="dropdown"]').click();
    cy.contains('Logout').should('be.visible');
  });

  it('should logout from dropdown menu', () => {
    cy.visit('/dashboard');
    cy.get('[data-bs-toggle="dropdown"]').click();
    cy.contains('Logout').click();
    cy.url().should('include', '/login');
  });

  it('should show brand logo and navigate to dashboard', () => {
    cy.visit('/agents');
    cy.get('.navbar-brand').click();
    cy.url().should('include', '/dashboard');
  });

  it('should be responsive on mobile', () => {
    cy.viewport('iphone-6');
    cy.visit('/dashboard');
    
    cy.get('.navbar-toggler').should('be.visible');
    cy.get('.navbar-toggler').click();
    cy.get('.navbar-collapse').should('be.visible');
  });

  it('should not show navbar when not logged in', () => {
    cy.visit('/login');
    cy.get('.navbar').should('not.exist');
  });
});