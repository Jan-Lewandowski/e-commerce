import bcrypt from 'bcryptjs';

export const users = [
  {
    id: 'usr-admin',
    email: 'admin@example.com',
    password: bcrypt.hashSync('password', 8),
    role: 'admin',
  },
];

export const sessions = [];
