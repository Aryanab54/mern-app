import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { agentAPI, listAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalAgents: 0,
    totalLists: 0
  });
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [agentsRes, listsRes] = await Promise.all([
        agentAPI.getAll(),
        listAPI.getDistributed()
      ]);
      
      const agentsData = agentsRes.data.data || agentsRes.data;
      const listsData = listsRes.data.data || listsRes.data;
      
      setStats({
        totalAgents: Array.isArray(agentsData) ? agentsData.length : 0,
        totalLists: Array.isArray(listsData) ? listsData.reduce((acc, agent) => acc + (agent.lists?.length || 0), 0) : 0
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
      setStats({ totalAgents: 0, totalLists: 0 });
    }
  };

  return (
    <div className="bg-light min-vh-100">
      <Container className="py-4">
        <div className="mb-4">
          <h1 className="display-6 fw-bold text-dark mb-2">Welcome back, Admin!</h1>
          <p className="text-muted">Here's what's happening with your MERN application today.</p>
        </div>
        
        <Row className="mb-5">
          <Col lg={6} className="mb-4">
            <Card className="border-0 shadow-sm h-100">
              <Card.Body className="d-flex align-items-center">
                <div className="bg-primary bg-gradient rounded-3 p-3 me-3">
                  <i className="fas fa-users text-white fs-3"></i>
                </div>
                <div>
                  <h6 className="text-muted mb-1">Total Agents</h6>
                  <h2 className="fw-bold mb-0">{stats.totalAgents}</h2>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col lg={6} className="mb-4">
            <Card className="border-0 shadow-sm h-100">
              <Card.Body className="d-flex align-items-center">
                <div className="bg-success bg-gradient rounded-3 p-3 me-3">
                  <i className="fas fa-list-alt text-white fs-3"></i>
                </div>
                <div>
                  <h6 className="text-muted mb-1">Total Lists</h6>
                  <h2 className="fw-bold mb-0">{stats.totalLists}</h2>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <h4 className="fw-bold mb-4">Quick Actions</h4>
        <Row>
          <Col lg={4} className="mb-4">
            <Card className="border-0 shadow-sm h-100 hover-card">
              <Card.Body className="text-center p-4">
                <div className="bg-primary bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{width: '60px', height: '60px'}}>
                  <i className="fas fa-user-plus text-primary fs-4"></i>
                </div>
                <h5 className="fw-bold mb-2">Manage Agents</h5>
                <p className="text-muted mb-3">Add new agents and manage existing ones</p>
                <Button 
                  variant="primary" 
                  className="fw-semibold"
                  onClick={() => navigate('/agents')}
                >
                  <i className="fas fa-arrow-right me-2"></i>
                  Go to Agents
                </Button>
              </Card.Body>
            </Card>
          </Col>
          
          <Col lg={4} className="mb-4">
            <Card className="border-0 shadow-sm h-100 hover-card">
              <Card.Body className="text-center p-4">
                <div className="bg-success bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{width: '60px', height: '60px'}}>
                  <i className="fas fa-cloud-upload-alt text-success fs-4"></i>
                </div>
                <h5 className="fw-bold mb-2">Upload Lists</h5>
                <p className="text-muted mb-3">Upload CSV files and distribute to agents</p>
                <Button 
                  variant="success" 
                  className="fw-semibold"
                  onClick={() => navigate('/upload')}
                >
                  <i className="fas fa-upload me-2"></i>
                  Upload Files
                </Button>
              </Card.Body>
            </Card>
          </Col>
          
          <Col lg={4} className="mb-4">
            <Card className="border-0 shadow-sm h-100 hover-card">
              <Card.Body className="text-center p-4">
                <div className="bg-info bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{width: '60px', height: '60px'}}>
                  <i className="fas fa-chart-bar text-info fs-4"></i>
                </div>
                <h5 className="fw-bold mb-2">View Distribution</h5>
                <p className="text-muted mb-3">Monitor distributed lists and assignments</p>
                <Button 
                  variant="info" 
                  className="fw-semibold"
                  onClick={() => navigate('/distribution')}
                >
                  <i className="fas fa-eye me-2"></i>
                  View Lists
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Dashboard;