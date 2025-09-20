import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Modal, Form, Table, Alert, Badge, InputGroup } from 'react-bootstrap';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { agentAPI } from '../services/api';

const Agents = () => {
  const [agents, setAgents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    try {
      const response = await agentAPI.getAll();
      setAgents(response.data.data || response.data);
    } catch (error) {
      setError('Failed to fetch agents');
    }
  };

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      mobile: '',
      password: ''
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Name is required'),
      email: Yup.string().email('Invalid email').required('Email is required'),
      mobile: Yup.string()
        .matches(/^\+\d{1,3}\d{10}$/, 'Mobile must include country code (+1234567890)')
        .required('Mobile is required'),
      password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required')
    }),
    onSubmit: async (values, { resetForm }) => {
      setLoading(true);
      setError('');
      setSuccess('');
      
      try {
        const agentData = { ...values, phone: values.mobile };
        delete agentData.mobile;
        await agentAPI.create(agentData);
        setSuccess('Agent created successfully');
        resetForm();
        setShowModal(false);
        fetchAgents();
      } catch (error) {
        setError(error.response?.data?.message || 'Failed to create agent');
      }
      setLoading(false);
    }
  });

  return (
    <div className="bg-light min-vh-100">
      <Container className="py-4">
        <Row className="align-items-center mb-4">
          <Col>
            <h1 className="display-6 fw-bold mb-2">Agents Management</h1>
            <p className="text-muted mb-0">Manage your team of agents and their information</p>
          </Col>
          <Col xs="auto">
            <Button 
              variant="primary" 
              size="lg"
              className="fw-semibold"
              onClick={() => setShowModal(true)}
            >
              <i className="fas fa-plus me-2"></i>
              Add Agent
            </Button>
          </Col>
        </Row>

        {error && <Alert variant="danger" dismissible onClose={() => setError('')} className="border-0 shadow-sm">{error}</Alert>}
        {success && <Alert variant="success" dismissible onClose={() => setSuccess('')} className="border-0 shadow-sm">{success}</Alert>}

        <Card className="border-0 shadow-sm">
          <Card.Header className="bg-white border-0 py-3">
            <div className="d-flex align-items-center justify-content-between">
              <h5 className="mb-0 fw-bold">All Agents</h5>
              <Badge bg="primary" className="fs-6">{agents.length} Total</Badge>
            </div>
          </Card.Header>
          <Card.Body className="p-0">
            {agents.length === 0 ? (
              <div className="text-center py-5">
                <i className="fas fa-users text-muted mb-3" style={{fontSize: '3rem'}}></i>
                <h5 className="text-muted">No agents found</h5>
                <p className="text-muted">Add your first agent to get started!</p>
              </div>
            ) : (
              <Table responsive className="mb-0">
                <thead className="bg-light">
                  <tr>
                    <th className="border-0 fw-semibold py-3">
                      <i className="fas fa-user me-2"></i>Name
                    </th>
                    <th className="border-0 fw-semibold py-3">
                      <i className="fas fa-envelope me-2"></i>Email
                    </th>
                    <th className="border-0 fw-semibold py-3">
                      <i className="fas fa-phone me-2"></i>Mobile
                    </th>
                    <th className="border-0 fw-semibold py-3">
                      <i className="fas fa-calendar me-2"></i>Created At
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {agents.map((agent, index) => (
                    <tr key={agent.id || agent._id || index} className={index % 2 === 0 ? 'bg-white' : 'bg-light bg-opacity-50'}>
                      <td className="py-3 fw-semibold">{agent.name}</td>
                      <td className="py-3 text-muted">{agent.email}</td>
                      <td className="py-3">
                        <Badge bg="outline-secondary" className="text-dark">{agent.phone}</Badge>
                      </td>
                      <td className="py-3 text-muted">{new Date(agent.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </Card.Body>
        </Card>

        <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
          <Modal.Header closeButton className="border-0 pb-0">
            <Modal.Title className="fw-bold">
              <i className="fas fa-user-plus me-2 text-primary"></i>
              Add New Agent
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="px-4">
            <Form onSubmit={formik.handleSubmit}>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold">Full Name</Form.Label>
                    <InputGroup>
                      <InputGroup.Text className="bg-light">
                        <i className="fas fa-user text-muted"></i>
                      </InputGroup.Text>
                      <Form.Control
                        type="text"
                        name="name"
                        placeholder="Enter full name"
                        value={formik.values.name}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        isInvalid={formik.touched.name && formik.errors.name}
                      />
                      <Form.Control.Feedback type="invalid">
                        {formik.errors.name}
                      </Form.Control.Feedback>
                    </InputGroup>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold">Email Address</Form.Label>
                    <InputGroup>
                      <InputGroup.Text className="bg-light">
                        <i className="fas fa-envelope text-muted"></i>
                      </InputGroup.Text>
                      <Form.Control
                        type="email"
                        name="email"
                        placeholder="Enter email address"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        isInvalid={formik.touched.email && formik.errors.email}
                      />
                      <Form.Control.Feedback type="invalid">
                        {formik.errors.email}
                      </Form.Control.Feedback>
                    </InputGroup>
                  </Form.Group>
                </Col>
              </Row>
              
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold">Mobile Number</Form.Label>
                    <InputGroup>
                      <InputGroup.Text className="bg-light">
                        <i className="fas fa-phone text-muted"></i>
                      </InputGroup.Text>
                      <Form.Control
                        type="text"
                        name="mobile"
                        placeholder="+1234567890"
                        value={formik.values.mobile}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        isInvalid={formik.touched.mobile && formik.errors.mobile}
                      />
                      <Form.Control.Feedback type="invalid">
                        {formik.errors.mobile}
                      </Form.Control.Feedback>
                    </InputGroup>
                    <Form.Text className="text-muted">Include country code (e.g., +1 for US)</Form.Text>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold">Password</Form.Label>
                    <InputGroup>
                      <InputGroup.Text className="bg-light">
                        <i className="fas fa-lock text-muted"></i>
                      </InputGroup.Text>
                      <Form.Control
                        type="password"
                        name="password"
                        placeholder="Enter password"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        isInvalid={formik.touched.password && formik.errors.password}
                      />
                      <Form.Control.Feedback type="invalid">
                        {formik.errors.password}
                      </Form.Control.Feedback>
                    </InputGroup>
                    <Form.Text className="text-muted">Minimum 6 characters</Form.Text>
                  </Form.Group>
                </Col>
              </Row>
            </Form>
          </Modal.Body>
          <Modal.Footer className="border-0 pt-0">
            <Button variant="outline-secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button 
              variant="primary" 
              onClick={formik.handleSubmit}
              disabled={loading}
              className="fw-semibold"
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2"></span>
                  Creating...
                </>
              ) : (
                <>
                  <i className="fas fa-plus me-2"></i>
                  Create Agent
                </>
              )}
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </div>
  );
};

export default Agents;