// Custom commands for login
Cypress.Commands.add('login', (email = 'admin@test.com', password = 'password123') => {
  cy.visit('/login');
  cy.get('input[name="email"]').type(email);
  cy.get('input[name="password"]').type(password);
  cy.get('button[type="submit"]').click();
  cy.url().should('include', '/dashboard');
});

// Custom command to intercept API calls
Cypress.Commands.add('mockAPI', () => {
  cy.intercept('POST', '**/api/auth/login', {
    statusCode: 200,
    body: {
      token: 'mock-jwt-token',
      user: { id: '1', email: 'admin@test.com' }
    }
  }).as('login');

  cy.intercept('GET', '**/api/agents', {
    statusCode: 200,
    body: [
      {
        _id: '1',
        name: 'John Doe',
        email: 'john@test.com',
        mobile: '+1234567890',
        createdAt: '2024-01-01T00:00:00.000Z'
      }
    ]
  }).as('getAgents');

  cy.intercept('POST', '**/api/agents', {
    statusCode: 201,
    body: {
      _id: '2',
      name: 'New Agent',
      email: 'new@test.com',
      mobile: '+1555555555',
      createdAt: new Date().toISOString()
    }
  }).as('createAgent');

  cy.intercept('POST', '**/api/lists/upload', {
    statusCode: 200,
    body: {
      message: 'File uploaded and distributed successfully among 5 agents'
    }
  }).as('uploadFile');

  cy.intercept('GET', '**/api/lists/distributed', {
    statusCode: 200,
    body: [
      {
        agentId: '1',
        agentName: 'John Doe',
        lists: [
          {
            firstName: 'Alice',
            phone: '1234567890',
            notes: 'Test note',
            assignedAt: '2024-01-01T00:00:00.000Z'
          }
        ]
      }
    ]
  }).as('getDistribution');
});