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

import {describe, it, expect, beforeEach, afterEach, vi} from 'vitest'
import {navigateAfterLogin} from '../../../shared/util/loginRouter'
import {safeSetSessionStorage, clearRoleSelection} from '../react/sessionStorageUtils'
import type {UserRole} from '../react/types'

/**
 * Integration tests for login router hookup
 * Validates: Requirements 3.4, 5.1
 * Task: 11.3 - Hook router into authentication success handler
 */
describe('Login Router Integration', () => {
  let originalLocation: Location

  beforeEach(() => {
    // Store original location
    originalLocation = window.location
    
    // Mock window.location.href
    delete (window as any).location
    window.location = {
      ...originalLocation,
      href: '',
    } as Location

    // Clear sessionStorage before each test
    clearRoleSelection()
  })

  afterEach(() => {
    // Restore original location
    window.location = originalLocation
    clearRoleSelection()
  })

  it('should navigate to role-specific page when role is in sessionStorage', () => {
    // Arrange: Set a role in sessionStorage
    const role: UserRole = 'student'
    safeSetSessionStorage(role)

    // Act: Call navigateAfterLogin (simulating successful authentication)
    navigateAfterLogin()

    // Assert: Should navigate to student dashboard
    expect(window.location.href).toBe('/dashboard/student')
  })

  it('should clear role from sessionStorage after navigation', () => {
    // Arrange: Set a role in sessionStorage
    const role: UserRole = 'faculty'
    safeSetSessionStorage(role)

    // Act: Call navigateAfterLogin
    navigateAfterLogin()

    // Assert: Role should be cleared from sessionStorage
    const storedRole = sessionStorage.getItem('canvas_selected_role')
    expect(storedRole).toBeNull()
  })

  it('should navigate to default page when no role is selected', () => {
    // Arrange: Ensure no role in sessionStorage
    clearRoleSelection()

    // Act: Call navigateAfterLogin
    navigateAfterLogin()

    // Assert: Should navigate to default dashboard
    expect(window.location.href).toBe('/dashboard')
  })

  it('should navigate to correct page for each role', () => {
    const roleTests: Array<{role: UserRole; expectedUrl: string}> = [
      {role: 'student', expectedUrl: '/dashboard/student'},
      {role: 'faculty', expectedUrl: '/dashboard/faculty'},
      {role: 'staff', expectedUrl: '/dashboard/staff'},
      {role: 'admin', expectedUrl: '/admin/dashboard'},
      {role: 'guardian', expectedUrl: '/dashboard/guardian'},
      {role: 'hod', expectedUrl: '/dashboard/hod'},
    ]

    roleTests.forEach(({role, expectedUrl}) => {
      // Arrange: Set role
      safeSetSessionStorage(role)

      // Act: Navigate
      navigateAfterLogin()

      // Assert: Correct URL
      expect(window.location.href).toBe(expectedUrl)

      // Reset for next iteration
      window.location.href = ''
    })
  })
})
