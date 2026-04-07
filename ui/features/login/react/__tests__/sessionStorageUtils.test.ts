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

import {
  validateRole,
  safeSetSessionStorage,
  safeGetSessionStorage,
  clearRoleSelection,
} from '../sessionStorageUtils'
import type {UserRole} from '../types'

describe('sessionStorageUtils', () => {
  beforeEach(() => {
    sessionStorage.clear()
    jest.clearAllMocks()
  })

  describe('validateRole', () => {
    it('returns true for valid student role', () => {
      expect(validateRole('student')).toBe(true)
    })

    it('returns true for valid faculty role', () => {
      expect(validateRole('faculty')).toBe(true)
    })

    it('returns true for valid staff role', () => {
      expect(validateRole('staff')).toBe(true)
    })

    it('returns true for valid admin role', () => {
      expect(validateRole('admin')).toBe(true)
    })

    it('returns true for valid guardian role', () => {
      expect(validateRole('guardian')).toBe(true)
    })

    it('returns true for valid hod role', () => {
      expect(validateRole('hod')).toBe(true)
    })

    it('returns false for invalid role', () => {
      expect(validateRole('invalid')).toBe(false)
    })

    it('returns false for empty string', () => {
      expect(validateRole('')).toBe(false)
    })

    it('returns false for undefined', () => {
      expect(validateRole(undefined as any)).toBe(false)
    })
  })

  describe('safeSetSessionStorage', () => {
    it('stores role in sessionStorage', () => {
      const result = safeSetSessionStorage('student')
      expect(result).toBe(true)

      const stored = sessionStorage.getItem('canvas_selected_role')
      expect(stored).toBeTruthy()

      const data = JSON.parse(stored!)
      expect(data.role).toBe('student')
      expect(data.timestamp).toBeGreaterThan(0)
    })

    it('stores all valid roles', () => {
      const roles: UserRole[] = ['student', 'faculty', 'staff', 'admin', 'guardian', 'hod']

      roles.forEach(role => {
        sessionStorage.clear()
        const result = safeSetSessionStorage(role)
        expect(result).toBe(true)

        const stored = sessionStorage.getItem('canvas_selected_role')
        const data = JSON.parse(stored!)
        expect(data.role).toBe(role)
      })
    })

    it('returns false when sessionStorage is unavailable', () => {
      jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new Error('QuotaExceededError')
      })

      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation()

      const result = safeSetSessionStorage('student')
      expect(result).toBe(false)
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'SessionStorage unavailable:',
        expect.any(Error)
      )

      consoleErrorSpy.mockRestore()
    })
  })

  describe('safeGetSessionStorage', () => {
    it('retrieves stored role', () => {
      safeSetSessionStorage('faculty')
      const role = safeGetSessionStorage()
      expect(role).toBe('faculty')
    })

    it('returns null when no role is stored', () => {
      const role = safeGetSessionStorage()
      expect(role).toBeNull()
    })

    it('returns null and clears storage for invalid role', () => {
      sessionStorage.setItem(
        'canvas_selected_role',
        JSON.stringify({role: 'invalid', timestamp: Date.now()})
      )

      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation()

      const role = safeGetSessionStorage()
      expect(role).toBeNull()
      expect(sessionStorage.getItem('canvas_selected_role')).toBeNull()
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Invalid role value in sessionStorage:',
        'invalid'
      )

      consoleErrorSpy.mockRestore()
    })

    it('returns null when sessionStorage contains malformed JSON', () => {
      sessionStorage.setItem('canvas_selected_role', 'not valid json')

      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation()

      const role = safeGetSessionStorage()
      expect(role).toBeNull()
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error reading from sessionStorage:',
        expect.any(Error)
      )

      consoleErrorSpy.mockRestore()
    })

    it('returns null when sessionStorage is unavailable', () => {
      jest.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
        throw new Error('SecurityError')
      })

      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation()

      const role = safeGetSessionStorage()
      expect(role).toBeNull()
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error reading from sessionStorage:',
        expect.any(Error)
      )

      consoleErrorSpy.mockRestore()
    })
  })

  describe('clearRoleSelection', () => {
    it('removes role from sessionStorage', () => {
      safeSetSessionStorage('admin')
      expect(sessionStorage.getItem('canvas_selected_role')).toBeTruthy()

      clearRoleSelection()
      expect(sessionStorage.getItem('canvas_selected_role')).toBeNull()
    })

    it('handles errors gracefully when sessionStorage is unavailable', () => {
      jest.spyOn(Storage.prototype, 'removeItem').mockImplementation(() => {
        throw new Error('SecurityError')
      })

      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation()

      clearRoleSelection()
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error clearing sessionStorage:',
        expect.any(Error)
      )

      consoleErrorSpy.mockRestore()
    })
  })

  describe('integration scenarios', () => {
    it('round-trip preserves role value', () => {
      const originalRole: UserRole = 'staff'
      safeSetSessionStorage(originalRole)
      const retrievedRole = safeGetSessionStorage()
      expect(retrievedRole).toBe(originalRole)
    })

    it('handles role update correctly', () => {
      safeSetSessionStorage('student')
      expect(safeGetSessionStorage()).toBe('student')

      safeSetSessionStorage('faculty')
      expect(safeGetSessionStorage()).toBe('faculty')
    })

    it('handles clear and retrieve correctly', () => {
      safeSetSessionStorage('guardian')
      expect(safeGetSessionStorage()).toBe('guardian')

      clearRoleSelection()
      expect(safeGetSessionStorage()).toBeNull()
    })
  })
})
