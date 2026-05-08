# 🚀 Employee Management System (RBAC)

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![MySQL](https://img.shields.io/badge/MySQL-005C84?style=for-the-badge&logo=mysql&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens)

A powerful and secure full-stack web application designed to manage
organizational workflows through a structured **Role-Based Access Control (RBAC)** system.
This platform efficiently handles three types of users —
**Super Admin, Manager, and Employee** — each with their own defined roles,
permissions, and responsibilities.

---

## 👥 User Roles

### 👑 Super Admin
- Full access to the entire system
- Create, update, and delete Managers & Employees
- Assign roles and define permissions for every user
- Monitor all user activities in real time

### 👔 Manager
- Mid-level access
- Manage only assigned employees
- Assign tasks & track employee activity
- Approve/reject requests & generate reports

### 👨‍💼 Employee
- Restricted access
- View and perform only assigned tasks
- Update own profile
- Submit reports within defined role

---

## ✨ Key Features

- 🔐 Secure JWT-based Authentication & Authorization
- 🎭 Dynamic Role & Permission Management
- 📊 Activity Tracking for all users
- 🛡️ Protected Routes based on user roles
- 📱 Clean and Responsive Dashboard UI
- 🔄 REST API with Node.js & Express
- 🗄️ MySQL Relational Database
- 👁️ Real-time Activity Monitoring
- 📁 Scalable and Maintainable Codebase

---

## 🛠️ Tech Stack

| Layer          | Technology          |
|----------------|---------------------|
| Frontend       | React.js            |
| Backend        | Node.js & Express.js|
| Database       | MySQL               |
| ORM            | Sequelize / Knex.js |
| Authentication | JWT (JSON Web Token)|
| Styling        | Tailwind CSS / Bootstrap |

---

## ⚙️ Installation & Setup

### 1. Repository Clone Karo
```bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
```

### 2. MySQL Database Setup Karo
```sql
CREATE DATABASE employee_management;
USE employee_management;
-- Tables automatically create hongi Sequelize se
```

### 3. Backend Setup
```bash
cd backend
npm install
npm start
```

### 4. Frontend Setup
```bash
cd frontend
npm install
npm start
```

---

## 🔑 Environment Variables

Backend folder mein `.env` file banao:

```env
PORT=5000
NODE_ENV=production

# MySQL Database
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=employee_management
DB_PORT=3306

# JWT
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d
```

---

## 🗄️ Database Tables

```
📦 employee_management
 ┣ 📋 users          (id, name, email, password, role_id)
 ┣ 📋 roles          (id, role_name)
 ┣ 📋 permissions    (id, permission_name)
 ┣ 📋 role_permissions (role_id, permission_id)
 ┣ 📋 tasks          (id, title, assigned_to, assigned_by)
 ┗ 📋 activity_logs  (id, user_id, action, timestamp)
```

---

## 📁 Folder Structure

```
project/
├── frontend/                # React.js Frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   │   ├── SuperAdmin/
│   │   │   ├── Manager/
│   │   │   └── Employee/
│   │   ├── context/
│   │   └── App.js
│   └── package.json
│
├── backend/                 # Node.js Backend
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── adminController.js
│   │   ├── managerController.js
│   │   └── employeeController.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Role.js
│   │   └── Permission.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── adminRoutes.js
│   │   └── managerRoutes.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── roleMiddleware.js
│   └── server.js
│
└── README.md
```

---

## 🔗 API Endpoints

```
# Auth
POST   /api/auth/login        → Login
POST   /api/auth/logout       → Logout

# Super Admin
GET    /api/admin/users       → All users dekho
POST   /api/admin/users       → User banao
PUT    /api/admin/users/:id   → User update karo
DELETE /api/admin/users/:id   → User delete karo

# Manager
GET    /api/manager/employees → Apne employees dekho
POST   /api/manager/tasks     → Task assign karo
GET    /api/manager/reports   → Reports dekho

# Employee
GET    /api/employee/tasks    → Apne tasks dekho
PUT    /api/employee/profile  → Profile update karo
```

---

## 🌐 Live Demo

- **Frontend:** [your-frontend.onrender.com](https://your-frontend.onrender.com)
- **Backend API:** [your-backend.onrender.com](https://your-backend.onrender.com)

---

## 👨‍💻 Author

**Your Name**
- GitHub: [@your-username](https://github.com/your-username)
- LinkedIn: [your-linkedin](https://linkedin.com/in/your-profile)

---

## 📄 License

This project is licensed under the MIT License.