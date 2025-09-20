describe('Authentication Flow', () => {
  beforeEach(() => {
    cy.mockAPI();
  });

  it('should display login form', () => {
    cy.visit('/login');
    cy.contains('Admin Login').should('be.visible');
    cy.get('input[name="email"]').should('be.visible');
    cy.get('input[name="password"]').should('be.visible');
    cy.get('button[type="submit"]').should('contain', 'Sign In');
  });

  it('should show validation errors for empty fields', () => {
    cy.visit('/login');
    cy.get('button[type="submit"]').click();
    cy.contains('Email is required').should('be.visible');
    cy.contains('Password is required').should('be.visible');
  });

  it('should show validation error for invalid email', () => {
    cy.visit('/login');
    cy.get('input[name="email"]').type('invalid-email');
    cy.get('input[name="password"]').click();
    cy.contains('Invalid email').should('be.visible');
  });

  it('should login successfully with valid credentials', () => {
    cy.visit('/login');
    cy.get('input[name="email"]').type('admin@test.com');
    cy.get('input[name="password"]').type('password123');
    cy.get('button[type="submit"]').click();
    
    cy.wait('@login');
    cy.url().should('include', '/dashboard');
    cy.contains('Welcome back, Admin!').should('be.visible');
  });

  it('should logout successfully', () => {
    cy.login();
    cy.get('[data-bs-toggle="dropdown"]').click();
    cy.contains('Logout').click();
    cy.url().should('include', '/login');
  });

  it('should redirect to login when accessing protected routes without auth', () => {
    cy.visit('/dashboard');
    cy.url().should('include', '/login');
    
    cy.visit('/agents');
    cy.url().should('include', '/login');
    
    cy.visit('/upload');
    cy.url().should('include', '/login');
  });
});