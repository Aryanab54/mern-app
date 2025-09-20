import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, ProgressBar } from 'react-bootstrap';
import { listAPI } from '../services/api';

const Upload = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);

  const handleFileChange = (selectedFile) => {
    if (selectedFile) {
      const allowedTypes = [
        'text/csv',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      ];
      
      const fileExtension = selectedFile.name.split('.').pop().toLowerCase();
      const allowedExtensions = ['csv', 'xls', 'xlsx'];
      
      if (!allowedTypes.includes(selectedFile.type) && !allowedExtensions.includes(fileExtension)) {
        setError('Please select a valid CSV, XLS, or XLSX file');
        setFile(null);
        return;
      }
      
      setFile(selectedFile);
      setError('');
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file to upload');
      return;
    }

    setUploading(true);
    setError('');
    setSuccess('');
    setUploadProgress(0);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 200);

      const response = await listAPI.upload(formData);
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      setSuccess(`File uploaded successfully! ${response.data.message}`);
      setFile(null);
      
      const fileInput = document.getElementById('file-input');
      if (fileInput) fileInput.value = '';
      
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to upload file');
      setUploadProgress(0);
    }
    
    setUploading(false);
  };

  return (
    <div className="bg-light min-vh-100">
      <Container className="py-4">
        <Row className="justify-content-center">
          <Col lg={8}>
            <div className="mb-4 text-center">
              <h1 className="display-6 fw-bold mb-2">Upload & Distribute</h1>
              <p className="text-muted">Upload CSV files and automatically distribute to agents</p>
            </div>

            {error && <Alert variant="danger" dismissible onClose={() => setError('')} className="border-0 shadow-sm mb-4">{error}</Alert>}
            {success && <Alert variant="success" dismissible onClose={() => setSuccess('')} className="border-0 shadow-sm mb-4">{success}</Alert>}
            
            <Card className="border-0 shadow-sm mb-4">
              <Card.Body className="p-4">
                <div 
                  className={`border-2 border-dashed rounded-3 p-5 text-center mb-4 ${dragActive ? 'border-primary bg-primary bg-opacity-10' : 'border-secondary'}`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <div className="mb-3">
                    <i className="fas fa-cloud-upload-alt text-primary" style={{fontSize: '3rem'}}></i>
                  </div>
                  <h5 className="fw-bold mb-2">Drop your file here</h5>
                  <p className="text-muted mb-3">or click to browse</p>
                  
                  <Form.Control
                    id="file-input"
                    type="file"
                    accept=".csv,.xls,.xlsx"
                    onChange={(e) => handleFileChange(e.target.files[0])}
                    disabled={uploading}
                    className="d-none"
                  />
                  
                  <Button 
                    variant="outline-primary" 
                    onClick={() => document.getElementById('file-input').click()}
                    disabled={uploading}
                  >
                    <i className="fas fa-folder-open me-2"></i>
                    Browse Files
                  </Button>
                  
                  <div className="mt-3">
                    <small className="text-muted">
                      Supported formats: CSV, XLS, XLSX (Max 10MB)
                    </small>
                  </div>
                </div>

                {file && (
                  <Card className="bg-light border-0 mb-4">
                    <Card.Body className="py-3">
                      <div className="d-flex align-items-center">
                        <div className="bg-primary bg-opacity-10 rounded-2 p-2 me-3">
                          <i className="fas fa-file-csv text-primary"></i>
                        </div>
                        <div className="flex-grow-1">
                          <h6 className="mb-1 fw-semibold">{file.name}</h6>
                          <small className="text-muted">{(file.size / 1024).toFixed(2)} KB</small>
                        </div>
                        <Button 
                          variant="outline-danger" 
                          size="sm"
                          onClick={() => {
                            setFile(null);
                            document.getElementById('file-input').value = '';
                          }}
                        >
                          <i className="fas fa-times"></i>
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                )}

                {uploading && (
                  <div className="mb-4">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span className="fw-semibold">Uploading...</span>
                      <span className="text-muted">{uploadProgress}%</span>
                    </div>
                    <ProgressBar 
                      now={uploadProgress} 
                      animated
                      className="mb-2"
                      style={{height: '8px'}}
                    />
                  </div>
                )}

                <Button 
                  variant="primary" 
                  size="lg"
                  onClick={handleUpload}
                  disabled={!file || uploading}
                  className="w-100 fw-semibold"
                >
                  {uploading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Processing...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-upload me-2"></i>
                      Upload and Distribute
                    </>
                  )}
                </Button>
              </Card.Body>
            </Card>

            <Row>
              <Col md={6}>
                <Card className="border-0 shadow-sm h-100">
                  <Card.Body>
                    <h5 className="fw-bold mb-3">
                      <i className="fas fa-info-circle text-primary me-2"></i>
                      File Requirements
                    </h5>
                    <ul className="list-unstyled">
                      <li className="mb-2">
                        <i className="fas fa-check text-success me-2"></i>
                        <strong>FirstName:</strong> Text field
                      </li>
                      <li className="mb-2">
                        <i className="fas fa-check text-success me-2"></i>
                        <strong>Phone:</strong> Number field
                      </li>
                      <li className="mb-2">
                        <i className="fas fa-check text-success me-2"></i>
                        <strong>Notes:</strong> Text field (optional)
                      </li>
                    </ul>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={6}>
                <Card className="border-0 shadow-sm h-100">
                  <Card.Body>
                    <h5 className="fw-bold mb-3">
                      <i className="fas fa-cogs text-info me-2"></i>
                      Distribution Logic
                    </h5>
                    <p className="text-muted mb-0">
                      Data is automatically distributed equally among 5 agents. 
                      If records aren't divisible by 5, remaining items are 
                      distributed sequentially to ensure fair allocation.
                    </p>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Upload;