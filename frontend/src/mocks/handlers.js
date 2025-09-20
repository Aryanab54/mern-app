import { http, HttpResponse } from 'msw';

const API_BASE_URL = 'http://localhost:5001/api';

export const handlers = [
  // Auth handlers
  http.post(`${API_BASE_URL}/auth/login`, ({ request }) => {
    return HttpResponse.json({
      token: 'mock-jwt-token',
      user: { id: '1', email: 'admin@test.com' }
    });
  }),

  // Agent handlers
  http.get(`${API_BASE_URL}/agents`, () => {
    return HttpResponse.json([
      {
        _id: '1',
        name: 'John Doe',
        email: 'john@test.com',
        mobile: '+1234567890',
        createdAt: '2024-01-01T00:00:00.000Z'
      },
      {
        _id: '2',
        name: 'Jane Smith',
        email: 'jane@test.com',
        mobile: '+1987654321',
        createdAt: '2024-01-02T00:00:00.000Z'
      }
    ]);
  }),

  http.post(`${API_BASE_URL}/agents`, ({ request }) => {
    return HttpResponse.json({
      _id: '3',
      name: 'New Agent',
      email: 'new@test.com',
      mobile: '+1555555555',
      createdAt: new Date().toISOString()
    });
  }),

  // List handlers
  http.post(`${API_BASE_URL}/lists/upload`, () => {
    return HttpResponse.json({
      message: 'File uploaded and distributed successfully among 5 agents'
    });
  }),

  http.get(`${API_BASE_URL}/lists/distributed`, () => {
    return HttpResponse.json([
      {
        agentId: '1',
        agentName: 'John Doe',
        lists: [
          {
            firstName: 'Alice',
            phone: '1234567890',
            notes: 'Test note 1',
            assignedAt: '2024-01-01T00:00:00.000Z'
          }
        ]
      },
      {
        agentId: '2',
        agentName: 'Jane Smith',
        lists: [
          {
            firstName: 'Bob',
            phone: '9876543210',
            notes: 'Test note 2',
            assignedAt: '2024-01-01T00:00:00.000Z'
          }
        ]
      }
    ]);
  })
];