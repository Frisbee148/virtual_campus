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

import React, {useState, useEffect} from 'react'
import {safeGetSessionStorage, safeSetSessionStorage} from './sessionStorageUtils'
import {ROLE_DISPLAY_INFO, type UserRole} from './types'

/**
 * LoginPageContainer Component
 * 
 * Simple dropdown for role selection on login page.
 * Validates: Requirements 2.3, 2.4, 3.1, 3.2, 3.3
 */
const LoginPageContainer: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState<UserRole | ''>('')

  /**
   * Initialize state from sessionStorage on mount
   */
  useEffect(() => {
    const storedRole = safeGetSessionStorage()
    if (storedRole) {
      setSelectedRole(storedRole)
    }
  }, [])

  /**
   * Handle role selection from dropdown
   */
  const handleRoleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const role = event.target.value as UserRole
    if (role) {
      setSelectedRole(role)
      safeSetSessionStorage(role)
    }
  }

  const roles: UserRole[] = ['student', 'faculty', 'staff', 'admin', 'guardian', 'hod']

  return (
    <div style={{marginBottom: '20px'}}>
      <label
        htmlFor="role-select"
        style={{
          display: 'block',
          marginBottom: '8px',
          fontSize: '14px',
          fontWeight: '600',
          color: '#FFFFFF',
        }}
      >
        Select Your Role
      </label>
      <select
        id="role-select"
        value={selectedRole}
        onChange={handleRoleChange}
        required
        style={{
          width: '100%',
          padding: '12px',
          fontSize: '16px',
          border: '1px solid #C7CDD1',
          borderRadius: '4px',
          backgroundColor: '#FFFFFF',
          cursor: 'pointer',
          outline: 'none',
        }}
      >
        <option value="" disabled>
          Choose a role...
        </option>
        {roles.map(role => (
          <option key={role} value={role}>
            {ROLE_DISPLAY_INFO[role].label}
          </option>
        ))}
      </select>
    </div>
  )
}

export default LoginPageContainer
