import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Badge, Accordion, Spinner, Alert } from 'react-bootstrap';
import { listAPI } from '../services/api';

const Distribution = () => {
  const [distributedLists, setDistributedLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDistributedLists();
  }, []);

  const fetchDistributedLists = async () => {
    try {
      const response = await listAPI.getDistributed();
      const data = response.data.data || response.data;
      setDistributedLists(Array.isArray(data) ? data : []);
    } catch (error) {
      setError('Failed to fetch distributed lists');
      setDistributedLists([]);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="bg-light min-vh-100 d-flex align-items-center justify-content-center">
        <div className="text-center">
          <Spinner animation="border" variant="primary" className="mb-3" />
          <h5 className="text-muted">Loading distribution data...</h5>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-light min-vh-100">
        <Container className="py-4">
          <Alert variant="danger" className="border-0 shadow-sm">{error}</Alert>
        </Container>
      </div>
    );
  }

  const totalItems = Array.isArray(distributedLists) ? distributedLists.reduce((acc, agent) => acc + (agent.lists?.length || 0), 0) : 0;

  return (
    <div className="bg-light min-vh-100">
      <Container className="py-4">
        <div className="mb-4">
          <h1 className="display-6 fw-bold mb-2">Distribution Overview</h1>
          <p className="text-muted">View how lists are distributed among your agents</p>
        </div>
        
        {distributedLists.length === 0 ? (
          <Card className="border-0 shadow-sm text-center py-5">
            <Card.Body>
              <i className="fas fa-inbox text-muted mb-3" style={{fontSize: '4rem'}}></i>
              <h4 className="text-muted mb-2">No Distribution Data</h4>
              <p className="text-muted mb-0">Upload a CSV file to see distribution results here.</p>
            </Card.Body>
          </Card>
        ) : (
          <>
            <Row className="mb-4">
              <Col lg={8}>
                <Card className="border-0 shadow-sm">
                  <Card.Body>
                    <h5 className="fw-bold mb-3">
                      <i className="fas fa-chart-pie text-primary me-2"></i>
                      Distribution Summary
                    </h5>
                    <Row>
                      {distributedLists.map((agent) => (
                        <Col md={6} lg={4} key={agent.agentId} className="mb-3">
                          <div className="d-flex align-items-center p-2 bg-light rounded">
                            <div className="bg-primary bg-opacity-10 rounded-circle p-2 me-3">
                              <i className="fas fa-user text-primary"></i>
                            </div>
                            <div className="flex-grow-1">
                              <h6 className="mb-0 fw-semibold">{agent.agentName}</h6>
                              <small className="text-muted">{agent.lists.length} items</small>
                            </div>
                            <Badge bg="primary">{agent.lists.length}</Badge>
                          </div>
                        </Col>
                      ))}
                    </Row>
                  </Card.Body>
                </Card>
              </Col>
              <Col lg={4}>
                <Card className="border-0 shadow-sm h-100">
                  <Card.Body className="d-flex flex-column justify-content-center text-center">
                    <h2 className="display-4 fw-bold text-primary mb-2">{totalItems}</h2>
                    <h6 className="text-muted mb-0">Total Items Distributed</h6>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            <Card className="border-0 shadow-sm">
              <Card.Header className="bg-white border-0 py-3">
                <h5 className="mb-0 fw-bold">
                  <i className="fas fa-list-ul me-2"></i>
                  Detailed Distribution
                </h5>
              </Card.Header>
              <Card.Body className="p-0">
                <Accordion flush>
                  {distributedLists.map((agent, index) => (
                    <Accordion.Item eventKey={index.toString()} key={agent.agentId}>
                      <Accordion.Header>
                        <div className="d-flex align-items-center justify-content-between w-100 me-3">
                          <div className="d-flex align-items-center">
                            <div className="bg-primary bg-opacity-10 rounded-circle p-2 me-3">
                              <i className="fas fa-user text-primary"></i>
                            </div>
                            <div>
                              <h6 className="mb-0 fw-semibold">{agent.agentName}</h6>
                              <small className="text-muted">{agent.lists.length} assigned items</small>
                            </div>
                          </div>
                          <Badge bg="primary" className="fs-6">{agent.lists.length}</Badge>
                        </div>
                      </Accordion.Header>
                      <Accordion.Body className="p-0">
                        {agent.lists.length === 0 ? (
                          <div className="text-center py-4">
                            <i className="fas fa-inbox text-muted mb-2" style={{fontSize: '2rem'}}></i>
                            <p className="text-muted mb-0">No items assigned to this agent.</p>
                          </div>
                        ) : (
                          <Table responsive className="mb-0">
                            <thead className="bg-light">
                              <tr>
                                <th className="border-0 fw-semibold py-3">
                                  <i className="fas fa-user me-2"></i>First Name
                                </th>
                                <th className="border-0 fw-semibold py-3">
                                  <i className="fas fa-phone me-2"></i>Phone
                                </th>
                                <th className="border-0 fw-semibold py-3">
                                  <i className="fas fa-sticky-note me-2"></i>Notes
                                </th>
                                <th className="border-0 fw-semibold py-3">
                                  <i className="fas fa-calendar me-2"></i>Assigned Date
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {agent.lists.map((item, itemIndex) => (
                                <tr key={itemIndex} className={itemIndex % 2 === 0 ? 'bg-white' : 'bg-light bg-opacity-50'}>
                                  <td className="py-3 fw-semibold">{item.firstName}</td>
                                  <td className="py-3">
                                    <Badge bg="outline-secondary" className="text-dark">{item.phone}</Badge>
                                  </td>
                                  <td className="py-3 text-muted">{item.notes || '-'}</td>
                                  <td className="py-3 text-muted">{new Date(item.assignedAt).toLocaleDateString()}</td>
                                </tr>
                              ))}
                            </tbody>
                          </Table>
                        )}
                      </Accordion.Body>
                    </Accordion.Item>
                  ))}
                </Accordion>
              </Card.Body>
            </Card>
          </>
        )}
      </Container>
    </div>
  );
};

export default Distribution;