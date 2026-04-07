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

import React from 'react'
import {render, screen, fireEvent} from '@testing-library/react'
import RoleOption from '../RoleOption'
import type {UserRole} from '../types'

describe('RoleOption', () => {
  const mockOnClick = jest.fn()

  beforeEach(() => {
    mockOnClick.mockClear()
  })

  describe('rendering', () => {
    it('renders with correct label', () => {
      render(
        <RoleOption
          role="student"
          label="Student"
          ariaLabel="Select Student role"
          onClick={mockOnClick}
          isFirst={false}
        />
      )

      expect(screen.getByText('Student')).toBeInTheDocument()
    })

    it('renders with correct ARIA label', () => {
      render(
        <RoleOption
          role="faculty"
          label="Faculty"
          ariaLabel="Select Faculty role"
          onClick={mockOnClick}
          isFirst={false}
        />
      )

      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('aria-label', 'Select Faculty role')
    })

    it('renders with correct data-testid', () => {
      render(
        <RoleOption
          role="admin"
          label="Admin"
          ariaLabel="Select Admin role"
          onClick={mockOnClick}
          isFirst={false}
        />
      )

      expect(screen.getByTestId('role-option-admin')).toBeInTheDocument()
    })

    it('renders all role types correctly', () => {
      const roles: Array<{role: UserRole; label: string; ariaLabel: string}> = [
        {role: 'student', label: 'Student', ariaLabel: 'Select Student role'},
        {role: 'faculty', label: 'Faculty', ariaLabel: 'Select Faculty role'},
        {role: 'staff', label: 'Staff', ariaLabel: 'Select Staff role'},
        {role: 'admin', label: 'Admin', ariaLabel: 'Select Admin role'},
        {
          role: 'guardian',
          label: 'Guardian/Parent',
          ariaLabel: 'Select Guardian or Parent role',
        },
        {role: 'hod', label: 'HOD', ariaLabel: 'Select Head of Department role'},
      ]

      roles.forEach(({role, label, ariaLabel}) => {
        const {unmount} = render(
          <RoleOption
            role={role}
            label={label}
            ariaLabel={ariaLabel}
            onClick={mockOnClick}
            isFirst={false}
          />
        )

        expect(screen.getByText(label)).toBeInTheDocument()
        expect(screen.getByRole('button')).toHaveAttribute('aria-label', ariaLabel)

        unmount()
      })
    })
  })

  describe('click handling', () => {
    it('calls onClick with correct role when clicked', () => {
      render(
        <RoleOption
          role="staff"
          label="Staff"
          ariaLabel="Select Staff role"
          onClick={mockOnClick}
          isFirst={false}
        />
      )

      const button = screen.getByRole('button')
      fireEvent.click(button)

      expect(mockOnClick).toHaveBeenCalledTimes(1)
      expect(mockOnClick).toHaveBeenCalledWith('staff')
    })

    it('handles multiple clicks correctly', () => {
      render(
        <RoleOption
          role="guardian"
          label="Guardian/Parent"
          ariaLabel="Select Guardian or Parent role"
          onClick={mockOnClick}
          isFirst={false}
        />
      )

      const button = screen.getByRole('button')
      fireEvent.click(button)
      fireEvent.click(button)

      expect(mockOnClick).toHaveBeenCalledTimes(2)
      expect(mockOnClick).toHaveBeenNthCalledWith(1, 'guardian')
      expect(mockOnClick).toHaveBeenNthCalledWith(2, 'guardian')
    })
  })

  describe('keyboard handling', () => {
    it('calls onClick when Enter key is pressed', () => {
      render(
        <RoleOption
          role="hod"
          label="HOD"
          ariaLabel="Select Head of Department role"
          onClick={mockOnClick}
          isFirst={false}
        />
      )

      const button = screen.getByRole('button')
      fireEvent.keyDown(button, {key: 'Enter', code: 'Enter'})

      expect(mockOnClick).toHaveBeenCalledTimes(1)
      expect(mockOnClick).toHaveBeenCalledWith('hod')
    })

    it('calls onClick when Space key is pressed', () => {
      render(
        <RoleOption
          role="student"
          label="Student"
          ariaLabel="Select Student role"
          onClick={mockOnClick}
          isFirst={false}
        />
      )

      const button = screen.getByRole('button')
      fireEvent.keyDown(button, {key: ' ', code: 'Space'})

      expect(mockOnClick).toHaveBeenCalledTimes(1)
      expect(mockOnClick).toHaveBeenCalledWith('student')
    })

    it('does not call onClick for other keys', () => {
      render(
        <RoleOption
          role="faculty"
          label="Faculty"
          ariaLabel="Select Faculty role"
          onClick={mockOnClick}
          isFirst={false}
        />
      )

      const button = screen.getByRole('button')
      fireEvent.keyDown(button, {key: 'a', code: 'KeyA'})
      fireEvent.keyDown(button, {key: 'Escape', code: 'Escape'})
      fireEvent.keyDown(button, {key: 'Tab', code: 'Tab'})

      expect(mockOnClick).not.toHaveBeenCalled()
    })

    it('prevents default behavior for Enter key', () => {
      render(
        <RoleOption
          role="admin"
          label="Admin"
          ariaLabel="Select Admin role"
          onClick={mockOnClick}
          isFirst={false}
        />
      )

      const button = screen.getByRole('button')
      const event = new KeyboardEvent('keydown', {key: 'Enter', bubbles: true})
      const preventDefaultSpy = jest.spyOn(event, 'preventDefault')

      fireEvent(button, event)

      expect(preventDefaultSpy).toHaveBeenCalled()
    })

    it('prevents default behavior for Space key', () => {
      render(
        <RoleOption
          role="staff"
          label="Staff"
          ariaLabel="Select Staff role"
          onClick={mockOnClick}
          isFirst={false}
        />
      )

      const button = screen.getByRole('button')
      const event = new KeyboardEvent('keydown', {key: ' ', bubbles: true})
      const preventDefaultSpy = jest.spyOn(event, 'preventDefault')

      fireEvent(button, event)

      expect(preventDefaultSpy).toHaveBeenCalled()
    })
  })

  describe('accessibility', () => {
    it('has role="button"', () => {
      render(
        <RoleOption
          role="student"
          label="Student"
          ariaLabel="Select Student role"
          onClick={mockOnClick}
          isFirst={false}
        />
      )

      const button = screen.getByRole('button')
      expect(button).toBeInTheDocument()
    })

    it('has tabIndex=0 for keyboard navigation', () => {
      render(
        <RoleOption
          role="faculty"
          label="Faculty"
          ariaLabel="Select Faculty role"
          onClick={mockOnClick}
          isFirst={false}
        />
      )

      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('tabIndex', '0')
    })

    it('sets focus on first option when isFirst is true', async () => {
      render(
        <RoleOption
          role="student"
          label="Student"
          ariaLabel="Select Student role"
          onClick={mockOnClick}
          isFirst={true}
        />
      )

      const button = screen.getByRole('button')
      
      // Wait for the setTimeout to execute
      await new Promise(resolve => setTimeout(resolve, 10))
      
      expect(button).toHaveFocus()
    })

    it('does not set focus when isFirst is false', () => {
      render(
        <RoleOption
          role="faculty"
          label="Faculty"
          ariaLabel="Select Faculty role"
          onClick={mockOnClick}
          isFirst={false}
        />
      )

      const button = screen.getByRole('button')
      expect(button).not.toHaveFocus()
    })
  })

  describe('styling', () => {
    it('has cursor pointer style', () => {
      render(
        <RoleOption
          role="admin"
          label="Admin"
          ariaLabel="Select Admin role"
          onClick={mockOnClick}
          isFirst={false}
        />
      )

      const button = screen.getByRole('button')
      expect(button).toHaveStyle({cursor: 'pointer'})
    })
  })
})
