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

import type {UserRole} from './types'

const STORAGE_KEY = 'canvas_selected_role'

/**
 * Validates that a string is a valid UserRole
 * Validates: Requirements 2.3, 3.1, 3.2
 */
export function validateRole(role: string): role is UserRole {
  const validRoles: UserRole[] = ['student', 'faculty', 'staff', 'admin', 'guardian', 'hod']
  return validRoles.includes(role as UserRole)
}

/**
 * Safely stores a role selection in sessionStorage with error handling
 * Falls back gracefully if sessionStorage is unavailable
 * Validates: Requirements 2.3, 3.1
 */
export function safeSetSessionStorage(role: UserRole): boolean {
  try {
    const data = {
      role,
      timestamp: Date.now(),
    }
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    return true
  } catch (error) {
    console.error('SessionStorage unavailable:', error)
    return false
  }
}

/**
 * Safely retrieves and validates a role selection from sessionStorage
 * Returns null if storage is unavailable or role is invalid
 * Validates: Requirements 3.1, 3.2
 */
export function safeGetSessionStorage(): UserRole | null {
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY)
    if (!stored) {
      return null
    }

    const data = JSON.parse(stored)
    const role = data.role

    if (!validateRole(role)) {
      console.error('Invalid role value in sessionStorage:', role)
      clearRoleSelection()
      return null
    }

    return role
  } catch (error) {
    console.error('Error reading from sessionStorage:', error)
    return null
  }
}

/**
 * Clears the role selection from sessionStorage
 * Validates: Requirement 3.4
 */
export function clearRoleSelection(): void {
  try {
    sessionStorage.removeItem(STORAGE_KEY)
  } catch (error) {
    console.error('Error clearing sessionStorage:', error)
  }
}
