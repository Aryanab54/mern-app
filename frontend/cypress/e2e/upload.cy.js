describe('File Upload and Distribution', () => {
  beforeEach(() => {
    cy.mockAPI();
    cy.login();
  });

  it('should display upload page', () => {
    cy.visit('/upload');
    cy.contains('Upload & Distribute').should('be.visible');
    cy.contains('Drop your file here').should('be.visible');
    cy.contains('Browse Files').should('be.visible');
    cy.contains('File Requirements').should('be.visible');
    cy.contains('Distribution Logic').should('be.visible');
  });

  it('should show file requirements', () => {
    cy.visit('/upload');
    cy.contains('FirstName: Text field').should('be.visible');
    cy.contains('Phone: Number field').should('be.visible');
    cy.contains('Notes: Text field (optional)').should('be.visible');
  });

  it('should show distribution logic explanation', () => {
    cy.visit('/upload');
    cy.contains('Data is automatically distributed equally among 5 agents').should('be.visible');
  });

  it('should validate file selection', () => {
    cy.visit('/upload');
    cy.contains('Upload and Distribute').click();
    cy.contains('Please select a file to upload').should('be.visible');
  });

  it('should accept CSV file upload', () => {
    cy.visit('/upload');
    
    // Create a test CSV file
    const csvContent = 'FirstName,Phone,Notes\\nJohn,1234567890,Test note';
    const file = new File([csvContent], 'test.csv', { type: 'text/csv' });
    
    cy.get('input[type="file"]').selectFile({
      contents: Cypress.Buffer.from(csvContent),
      fileName: 'test.csv',
      mimeType: 'text/csv'
    }, { force: true });
    
    cy.contains('test.csv').should('be.visible');
    cy.contains('KB').should('be.visible');
  });

  it('should upload file successfully', () => {
    cy.visit('/upload');
    
    const csvContent = 'FirstName,Phone,Notes\\nJohn,1234567890,Test note';
    
    cy.get('input[type="file"]').selectFile({
      contents: Cypress.Buffer.from(csvContent),
      fileName: 'test.csv',
      mimeType: 'text/csv'
    }, { force: true });
    
    cy.contains('Upload and Distribute').click();
    cy.wait('@uploadFile');
    cy.contains('File uploaded successfully').should('be.visible');
  });

  it('should remove selected file', () => {
    cy.visit('/upload');
    
    const csvContent = 'FirstName,Phone,Notes\\nJohn,1234567890,Test note';
    
    cy.get('input[type="file"]').selectFile({
      contents: Cypress.Buffer.from(csvContent),
      fileName: 'test.csv',
      mimeType: 'text/csv'
    }, { force: true });
    
    cy.contains('test.csv').should('be.visible');
    cy.get('button').contains('×').click(); // Remove button
    cy.contains('test.csv').should('not.exist');
  });

  it('should show upload progress', () => {
    cy.visit('/upload');
    
    const csvContent = 'FirstName,Phone,Notes\\nJohn,1234567890,Test note';
    
    cy.get('input[type="file"]').selectFile({
      contents: Cypress.Buffer.from(csvContent),
      fileName: 'test.csv',
      mimeType: 'text/csv'
    }, { force: true });
    
    cy.contains('Upload and Distribute').click();
    cy.contains('Processing...').should('be.visible');
  });
});