import api from './api';
import toast from 'react-hot-toast';

// Enhanced mock user database
const mockUsers = [
  // Students (with and without NSU email)
  {
    id: '1',
    email: 'student@northsouth.edu',
    password: 'password',
    name: 'John Student',
    role: 'student',
    type: 'regular_student',
    department: 'Computer Science',
    phone: '+880123456789',
    hasNsuEmail: true,
    studentId: '2011234567'
  },
  {
    id: '2',
    email: 'newstudent@gmail.com',
    password: 'password',
    name: 'Alice Newcomer',
    role: 'student',
    type: 'fresher_student',
    department: 'Electrical Engineering',
    phone: '+880123456788',
    hasNsuEmail: false,
    studentId: '2022345678'
  },
  {
    id: '3',
    email: 'mohammad.rahman@northsouth.edu',
    password: 'password',
    name: 'Mohammad Rahman',
    role: 'student',
    type: 'regular_student',
    department: 'Business Administration',
    phone: '+880123456787',
    hasNsuEmail: true,
    studentId: '2013456789'
  },

  // Faculty with different priority levels
  {
    id: '4',
    email: 'prof.ahmed@northsouth.edu',
    password: 'password',
    name: 'Dr. Ahmed Hossain',
    role: 'faculty',
    type: 'department_chair',
    department: 'Computer Science',
    phone: '+880123456786',
    hasNsuEmail: true,
    facultyId: 'FAC001',
    priorityLevel: 'high'
  },
  {
    id: '5',
    email: 'assistant.prof@northsouth.edu',
    password: 'password',
    name: 'Dr. Fatima Begum',
    role: 'faculty',
    type: 'assistant_professor',
    department: 'Electrical Engineering',
    phone: '+880123456785',
    hasNsuEmail: true,
    facultyId: 'FAC002',
    priorityLevel: 'medium'
  },
  {
    id: '6',
    email: 'dean.engineering@northsouth.edu',
    password: 'password',
    name: 'Prof. Mohammad Ali',
    role: 'faculty',
    type: 'dean',
    department: 'Engineering',
    phone: '+880123456784',
    hasNsuEmail: true,
    facultyId: 'FAC003',
    priorityLevel: 'critical'
  },

  // Lab Instructors
  {
    id: '7',
    email: 'lab.cs@northsouth.edu',
    password: 'password',
    name: 'Mr. Hasan Labib',
    role: 'lab_instructor',
    type: 'computer_lab',
    department: 'Computer Science',
    phone: '+880123456783',
    hasNsuEmail: true,
    employeeId: 'LAB001'
  },
  {
    id: '8',
    email: 'lab.engineering@northsouth.edu',
    password: 'password',
    name: 'Ms. Sabrina Akter',
    role: 'lab_instructor',
    type: 'engineering_lab',
    department: 'Electrical Engineering',
    phone: '+880123456782',
    hasNsuEmail: true,
    employeeId: 'LAB002'
  },

  // Staff
  {
    id: '9',
    email: 'staff@northsouth.edu',
    password: 'password',
    name: 'Ms. Jahanara Begum',
    role: 'staff',
    type: 'administrative_staff',
    department: 'Registrar Office',
    phone: '+880123456781',
    hasNsuEmail: true,
    employeeId: 'STAFF001'
  },

  // IT Team
  {
    id: '10',
    email: 'frontdesk@northsouth.edu',
    password: 'password',
    name: 'Front Desk Operator',
    role: 'front_desk',
    department: 'IT Help Desk',
    phone: '+880123456780',
    hasNsuEmail: true
  },
  {
    id: '11',
    email: 'itstaff@northsouth.edu',
    password: 'password',
    name: 'IT Support Staff',
    role: 'it_staff',
    department: 'IT Department',
    phone: '+880123456779',
    hasNsuEmail: true
  },
  {
    id: '12',
    email: 'admin@northsouth.edu',
    password: 'password',
    name: 'System Administrator',
    role: 'admin',
    department: 'IT Administration',
    phone: '+880123456778',
    hasNsuEmail: true
  }
];

export const userService = {
  // Login user - accepts both NSU and non-NSU emails for students
  async login(email, password) {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Find user in mock database
      // Checks for exact Email AND Password match for all users (including students with Gmail)
      const user = mockUsers.find(u => u.email === email && u.password === password);
      
      if (!user) {
        throw new Error('Invalid email or password');
      }

      // Create user object without password
      const userWithoutPassword = { ...user };
      delete userWithoutPassword.password;

      // Generate mock token
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

  // Register new student (for freshers without NSU email)
  async registerStudent(studentData) {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if email already exists
      const existingUser = mockUsers.find(u => u.email === studentData.email);
      if (existingUser) {
        throw new Error('Email already registered');
      }

      const newStudent = {
        id: String(mockUsers.length + 1),
        ...studentData,
        role: 'student',
        type: 'fresher_student',
        hasNsuEmail: false, // Default for manual registration
        createdAt: new Date().toISOString()
      };
      
      mockUsers.push(newStudent);
      
      const { password, ...studentWithoutPassword } = newStudent;
      return studentWithoutPassword;
    } catch (error) {
      toast.error(error.message || 'Failed to register student');
      throw error;
    }
  },

  // Get current user
  async getCurrentUser() {
    try {
      const token = localStorage.getItem('nsu_ticket_token');
      
      if (!token) {
        throw new Error('No token found');
      }

      // Decode token to get user info
      const tokenData = JSON.parse(atob(token));
      
      // Find user in mock database
      const user = mockUsers.find(u => u.id === tokenData.userId);
      
      if (!user) {
        throw new Error('User not found');
      }

      // Return user without password
      const userWithoutPassword = { ...user };
      delete userWithoutPassword.password;

      return userWithoutPassword;
    } catch (error) {
      throw new Error('Failed to get current user');
    }
  },

  // Get all users (for admin)
  async getUsers() {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Return users without passwords
      return mockUsers.map(user => {
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
      });
    } catch (error) {
      toast.error('Failed to fetch users');
      throw error;
    }
  },

  // Create user (Admin function)
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
      toast.error('Failed to create user');
      throw error;
    }
  },

  // Update user
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
      toast.error('Failed to update user');
      throw error;
    }
  },

  // Change password
  async changePassword(oldPassword, newPassword) {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const token = localStorage.getItem('nsu_ticket_token');
      if (!token) {
        throw new Error('Not authenticated');
      }
      
      const tokenData = JSON.parse(atob(token));
      const user = mockUsers.find(u => u.id === tokenData.userId);
      
      if (!user || user.password !== oldPassword) {
        throw new Error('Current password is incorrect');
      }
      
      user.password = newPassword;
      
      return { success: true };
    } catch (error) {
      toast.error('Failed to change password');
      throw error;
    }
  },

  // Logout
  logout() {
    localStorage.removeItem('nsu_ticket_token');
    toast.success('Logged out successfully!');
  }
};