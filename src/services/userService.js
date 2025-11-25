import api from './api';
import toast from 'react-hot-toast';

// Enhanced user database with all roles
const mockUsers = [
  // Super Admin (Full System Control)
  {
    id: '1',
    email: 'superadmin@northsouth.edu',
    password: 'password',
    name: 'Super Administrator',
    role: 'super_admin',
    department: 'IT Administration',
    phone: '+880123456700',
    hasNsuEmail: true,
    permissions: ['all']
  },

  // Admin (Multiple Admins with Limited Control)
  {
    id: '2',
    email: 'admin@northsouth.edu',
    password: 'password',
    name: 'System Admin',
    role: 'admin',
    department: 'IT Management',
    phone: '+880123456701',
    hasNsuEmail: true,
    permissions: ['manage_tickets', 'manage_users', 'view_reports', 'assign_tasks']
  },

  // IT Staff
  // In mockUsers array, ensure you have:
{
  id: '3',
  email: 'itstaff1@northsouth.edu',
  password: 'password',
  name: 'IT Support Technician 1',
  role: 'it_staff',
  department: 'IT Support',
  phone: '+880123456702',
  hasNsuEmail: true,
  specialization: ['hardware', 'software']
},
{
  id: '4',
  email: 'itstaff2@northsouth.edu',
  password: 'password',
  name: 'IT Support Technician 2',
  role: 'it_staff', 
  department: 'Network Support',
  phone: '+880123456703',
  hasNsuEmail: true,
  specialization: ['network', 'security']
},
  // Faculty
  {
    id: '5',
    email: 'prof.ahmed@northsouth.edu',
    facultyId: 'FAC001',
    password: 'password',
    name: 'Dr. Ahmed Hossain',
    role: 'faculty',
    department: 'Computer Science',
    phone: '+880123456704',
    hasNsuEmail: true
  },

  // Staff
  {
    id: '6',
    email: 'staff@northsouth.edu',
    password: 'password',
    name: 'Administrative Staff',
    role: 'staff',
    department: 'Registrar Office',
    phone: '+880123456705',
    hasNsuEmail: true
  },

  // Students
  {
    id: '7',
    email: 'student@northsouth.edu',
    password: 'password',
    name: 'John Student',
    role: 'student',
    department: 'Computer Science',
    phone: '+880123456706',
    hasNsuEmail: true,
    studentId: '2024123456'
  },

  // Lab Instructor
  {
    id: '8',
    email: 'lab.cs@northsouth.edu',
    password: 'password',
    name: 'Lab Instructor CS',
    role: 'lab_instructor',
    department: 'Computer Science',
    phone: '+880123456707',
    hasNsuEmail: true
  }
];

// Enhanced ticket database
let mockTickets = [
  {
    id: 'TKT-001',
    title: 'Internet connectivity issue in Library',
    description: 'No internet access on 3rd floor computers',
    category: 'network',
    priority: 'high',
    status: 'in_progress',
    submittedBy: '7',
    submittedByName: 'John Student',
    submittedByEmail: 'student@northsouth.edu',
    assignedTo: '3',
    assignedToName: 'IT Support Technician 1',
    createdAt: new Date('2024-01-15').toISOString(),
    updatedAt: new Date('2024-01-16').toISOString(),
    slaStatus: 'warning',
    comments: [
      {
        id: '1',
        userId: '3',
        userName: 'IT Support Technician 1',
        message: 'Checking network switch configuration',
        timestamp: new Date('2024-01-15 10:30:00').toISOString(),
        isInternal: false
      }
    ],
    feedback: null
  }
];

// NSU Email Requests (Treated as tickets)
let nsuEmailRequests = [];

// OTP Storage (In-memory map)
const otpStorage = new Map();

export const userService = {
  // Enhanced login with all roles
  async login(identifier, password) {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const user = mockUsers.find(u => 
        (u.email === identifier || u.facultyId === identifier) && 
        u.password === password
      );
      
      if (!user) {
        throw new Error('Invalid credentials');
      }

      const userWithoutPassword = { ...user };
      delete userWithoutPassword.password;

      const token = btoa(JSON.stringify({ 
        userId: user.id, 
        email: user.email,
        role: user.role 
      }));

      return {
        user: userWithoutPassword,
        token: token
      };
    } catch (error) {
      throw new Error(error.message || 'Login failed');
    }
  },

  // --- OTP System for New Users ---

  // Request OTP
  async requestOTP(emailOrFacultyId) {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Check if user already exists
      const existingUser = mockUsers.find(u => 
        u.email === emailOrFacultyId || u.facultyId === emailOrFacultyId
      );
      
      if (existingUser) {
        throw new Error('User already exists. Please login directly.');
      }

      // Generate 6-digit OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      otpStorage.set(emailOrFacultyId, {
        otp,
        expiresAt: Date.now() + 10 * 60 * 1000 // 10 minutes
      });

      // In real implementation, send OTP via email/SMS
      // This log helps you test the OTP in development console
      console.log(`OTP for ${emailOrFacultyId}: ${otp}`);
      
      return { success: true, message: 'OTP sent successfully' };
    } catch (error) {
      throw new Error(error.message || 'Failed to send OTP');
    }
  },

  // Verify OTP and create account
  async verifyOTPAndCreate(emailOrFacultyId, otp, password, userData = {}) {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const storedOTP = otpStorage.get(emailOrFacultyId);
      
      if (!storedOTP || storedOTP.otp !== otp) {
        throw new Error('Invalid OTP');
      }

      if (Date.now() > storedOTP.expiresAt) {
        otpStorage.delete(emailOrFacultyId);
        throw new Error('OTP has expired');
      }

      // Create new user
      const newUser = {
        id: String(mockUsers.length + 1),
        email: emailOrFacultyId.includes('@') ? emailOrFacultyId : `${emailOrFacultyId}@northsouth.edu`,
        facultyId: emailOrFacultyId.includes('@') ? undefined : emailOrFacultyId,
        password,
        name: userData.name || 'New User',
        role: userData.role || 'faculty', // Default role if not specified
        department: userData.department || 'General',
        phone: userData.phone || '',
        hasNsuEmail: true,
        createdAt: new Date().toISOString()
      };

      mockUsers.push(newUser);
      otpStorage.delete(emailOrFacultyId);

      const { password: _, ...userWithoutPassword } = newUser;
      
      return {
        user: userWithoutPassword,
        token: btoa(JSON.stringify({ 
          userId: newUser.id, 
          email: newUser.email,
          role: newUser.role 
        }))
      };
    } catch (error) {
      throw new Error(error.message || 'OTP verification failed');
    }
  },

  // --- End OTP System ---

  // Get all users (for admin/super_admin)
  async getUsers() {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      return mockUsers.map(user => {
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
      });
    } catch (error) {
      throw new Error('Failed to fetch users');
    }
  },

  // Create new user (super_admin only)
  async createUser(userData) {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newUser = {
        id: String(mockUsers.length + 1),
        ...userData,
        createdAt: new Date().toISOString()
      };
      
      mockUsers.push(newUser);
      
      const { password, ...userWithoutPassword } = newUser;
      return userWithoutPassword;
    } catch (error) {
      throw new Error('Failed to create user');
    }
  },

  // Update user (admin/super_admin)
  async updateUser(id, updates) {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const userIndex = mockUsers.findIndex(u => u.id === id);
      if (userIndex === -1) {
        throw new Error('User not found');
      }
      
      mockUsers[userIndex] = { ...mockUsers[userIndex], ...updates };
      
      const { password, ...userWithoutPassword } = mockUsers[userIndex];
      return userWithoutPassword;
    } catch (error) {
      throw new Error('Failed to update user');
    }
  },

  // Get current user
  async getCurrentUser() {
    try {
      const token = localStorage.getItem('nsu_ticket_token');
      if (!token) throw new Error('No token found');

      const tokenData = JSON.parse(atob(token));
      const user = mockUsers.find(u => u.id === tokenData.userId);
      if (!user) throw new Error('User not found');

      const userWithoutPassword = { ...user };
      delete userWithoutPassword.password;
      return userWithoutPassword;
    } catch (error) {
      throw new Error('Failed to get current user');
    }
  },

  // NSU Email Request (treated as ticket)
  async requestNsuEmail(studentData) {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const ticketId = `NSUEMAIL-${Date.now()}`;
      const request = {
        id: ticketId,
        ...studentData,
        type: 'nsu_email_request',
        status: 'pending',
        priority: 'medium',
        submittedBy: 'external',
        submittedByName: studentData.name,
        submittedByEmail: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        comments: []
      };
      
      nsuEmailRequests.push(request);
      return { success: true, ticketId };
    } catch (error) {
      throw new Error('Failed to submit request');
    }
  },

  // Approve NSU Email and convert to user account
  async approveNsuEmail(ticketId, generatedEmail) {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const request = nsuEmailRequests.find(req => req.id === ticketId);
      if (!request) throw new Error('Request not found');

      // Create student account
      const tempPassword = Math.random().toString(36).slice(-8);
      const newStudent = {
        id: String(mockUsers.length + 1),
        email: generatedEmail,
        password: tempPassword,
        name: request.name,
        role: 'student',
        department: request.program,
        phone: request.phone,
        studentId: request.admissionNo,
        hasNsuEmail: true,
        createdAt: new Date().toISOString()
      };

      mockUsers.push(newStudent);
      
      // Update request status
      request.status = 'approved';
      request.generatedEmail = generatedEmail;
      request.tempPassword = tempPassword;
      request.approvedAt = new Date().toISOString();
      request.approvedBy = 'super_admin';
      
      return { success: true, email: generatedEmail, tempPassword };
    } catch (error) {
      throw new Error('Failed to approve NSU email');
    }
  },
  
  logout() {
    localStorage.removeItem('nsu_ticket_token');
    toast.success('Logged out successfully!');
  }
};