/*
 * Copyright (C) 2024 - present Instructure, Inc.
 *
 * This file is part of Canvas.
 *
 * Canvas is free software: you can redistribute it and/or modify it under
 * the terms of the GNU Affero General Public License as published by the Free
 * Software Foundation, version 3 of the License.
 *
 * Canvas is distributed in the hope that it will be useful, but WITHOUT ANY
 * WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR
 * A PARTICULAR PURPOSE. See the GNU Affero General Public License for more
 * details.
 *
 * You should have received a copy of the GNU Affero General Public License along
 * with this program. If not, see <http://www.gnu.org/licenses/>.
 */

/**
 * User role type representing the six available roles in Canvas LMS
 * Validates: Requirements 1.2, 5.3, 7.4
 */
export type UserRole = 'student' | 'faculty' | 'staff' | 'admin' | 'guardian' | 'hod'

/**
 * Interface for role display metadata
 * Contains human-readable labels and accessibility text for each role
 */
export interface RoleDisplayInfo {
  value: UserRole
  label: string
  ariaLabel: string
}

/**
 * Interface for role-to-route mapping configuration
 * Defines the target URL for each role after successful authentication
 */
export interface RoleRouteMap {
  student: string
  faculty: string
  staff: string
  admin: string
  guardian: string
  hod: string
  default: string
}

/**
 * Route configuration mapping roles to their respective dashboard URLs
 * Used by the frontend router to navigate users after authentication
 * Validates: Requirement 5.3
 */
export const ROLE_ROUTES: RoleRouteMap = {
  student: '/dashboard/student',
  faculty: '/dashboard/faculty',
  staff: '/dashboard/staff',
  admin: '/admin/dashboard',
  guardian: '/dashboard/guardian',
  hod: '/dashboard/hod',
  default: '/dashboard',
}

/**
 * Display information for each role option
 * Provides labels and ARIA text for accessibility
 * Validates: Requirements 1.2, 7.4
 */
export const ROLE_DISPLAY_INFO: Record<UserRole, RoleDisplayInfo> = {
  student: {
    value: 'student',
    label: 'Student',
    ariaLabel: 'Select Student role',
  },
  faculty: {
    value: 'faculty',
    label: 'Faculty',
    ariaLabel: 'Select Faculty role',
  },
  staff: {
    value: 'staff',
    label: 'Staff',
    ariaLabel: 'Select Staff role',
  },
  admin: {
    value: 'admin',
    label: 'Admin',
    ariaLabel: 'Select Admin role',
  },
  guardian: {
    value: 'guardian',
    label: 'Guardian/Parent',
    ariaLabel: 'Select Guardian or Parent role',
  },
  hod: {
    value: 'hod',
    label: 'HOD',
    ariaLabel: 'Select Head of Department role',
  },
}
