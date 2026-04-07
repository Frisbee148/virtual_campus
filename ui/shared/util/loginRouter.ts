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

import type {UserRole} from '../../features/login/react/types'
import {ROLE_ROUTES} from '../../features/login/react/types'
import {safeGetSessionStorage, clearRoleSelection} from '../../features/login/react/sessionStorageUtils'

/**
 * Navigates user to role-specific page after successful authentication
 * Reads role from sessionStorage and routes to appropriate dashboard
 * Clears role from sessionStorage after reading to prevent reuse
 * Validates: Requirements 3.4, 5.1, 5.2, 5.3, 5.4
 */
export function navigateAfterLogin(): void {
  const selectedRole: UserRole | null = safeGetSessionStorage()
  
  // Clear role from sessionStorage after reading (Requirement 3.4)
  clearRoleSelection()

  if (selectedRole && ROLE_ROUTES[selectedRole]) {
    window.location.href = ROLE_ROUTES[selectedRole]
  } else {
    window.location.href = ROLE_ROUTES.default
  }
}
