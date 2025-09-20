// Mock API for testing without backend
export const mockAuthAPI = {
  login: async (credentials) => {
    console.log('Mock login attempt:', credentials);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Accept any email/password for demo
    return {
      data: {
        token: 'mock-jwt-token',
        user: { id: '1', email: credentials.email }
      }
    };
  }
};

export const mockAgentAPI = {
  getAll: async () => ({
    data: [
      { _id: '1', name: 'John Doe', email: 'john@test.com', mobile: '+1234567890', createdAt: new Date() },
      { _id: '2', name: 'Jane Smith', email: 'jane@test.com', mobile: '+1987654321', createdAt: new Date() }
    ]
  }),
  create: async (data) => ({
    data: { _id: Date.now().toString(), ...data, createdAt: new Date() }
  })
};

export const mockListAPI = {
  upload: async () => ({
    data: { message: 'File uploaded and distributed successfully among 5 agents' }
  }),
  getDistributed: async () => ({
    data: [
      {
        agentId: '1',
        agentName: 'John Doe',
        lists: [{ firstName: 'Alice', phone: '1234567890', notes: 'Test', assignedAt: new Date() }]
      }
    ]
  })
};