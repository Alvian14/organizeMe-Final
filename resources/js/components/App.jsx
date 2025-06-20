import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Auth Pages
import Login from '../pages/auth/login/form_login';
import Register from "../pages/auth/register/form_register";

// Public Pages
import Home from '../pages';
import AccountInfoPage from '../pages/settings';

// Dashboard Layouts
import DashboardLayout from './layouts/DashboardLayout';
import DashboardAdmin from './layouts/DashboardAdmin';

// Dashboard Pages
import TaskDashboard from "../pages/dasboard/TaskDashboard";
import MyTask from "../pages/mytask";

// Admin Pages
import UsersPageAdmin from '../pages/admin/UsersPageAdmin';
import TaskAdmin from '../pages/admin/TaskAdmin';
import UserTaskDetail from '../pages/admin/UserTaskDetail'; // ← Tambahkan ini
import AccountInfoPageAdmin from '../pages/admin/AccountInfoPageAdmin';
import LogoutModal from '../pages/logout';
import ForgotPassword from '../pages/auth/forgot-password/forgot_password';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/settings" element={<AccountInfoPage />} />
        <Route path="/logout" element={<LogoutModal/>} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* User Dashboard routes */}
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<TaskDashboard />} />
          <Route path="/mytask" element={<MyTask />} />
          <Route path="/dashboard/settings" element={<AccountInfoPage />} />

        </Route>

        {/* Admin Dashboard routes */}
        <Route element={<DashboardAdmin/>}>
          <Route path="/admin/user-page-admin" element={<UsersPageAdmin />} />
          <Route path="/admin/task-admin" element={<TaskAdmin />} />
          <Route path="/admin/task-admin/:id" element={<UserTaskDetail />} />
          <Route path="/admin/settings" element={<AccountInfoPageAdmin />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
