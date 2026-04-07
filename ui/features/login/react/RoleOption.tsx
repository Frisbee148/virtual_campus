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

import React, {useRef, useEffect} from 'react'
import {View} from '@instructure/ui-view'
import {Text} from '@instructure/ui-text'
import type {UserRole} from './types'

/**
 * Props for the RoleOption component
 * Validates: Requirements 1.3, 7.1, 7.2, 7.3, 7.4
 */
export interface RoleOptionProps {
  role: UserRole
  label: string
  ariaLabel: string
  onClick: (role: UserRole) => void
  isFirst: boolean
}

/**
 * RoleOption Component
 * 
 * Renders an individual role option in the role selection dialog.
 * Provides full keyboard navigation and accessibility support.
 * 
 * Validates: Requirements 1.3, 7.1, 7.2, 7.3, 7.4
 */
const RoleOption: React.FC<RoleOptionProps> = ({
  role,
  label,
  ariaLabel,
  onClick,
  isFirst,
}) => {
  const buttonRef = useRef<HTMLElement>(null)

  // Set focus to first option when component mounts (Requirement 7.5)
  useEffect(() => {
    if (isFirst && buttonRef.current) {
      // Use setTimeout to ensure DOM is ready
      setTimeout(() => {
        buttonRef.current?.focus()
      }, 0)
    }
  }, [isFirst])

  /**
   * Handle keyboard events for Enter and Space keys
   * Validates: Requirement 7.3
   */
  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      onClick(role)
    }
  }

  /**
   * Handle click events
   * Validates: Requirement 1.3
   */
  const handleClick = () => {
    onClick(role)
  }

  return (
    <View
      as="div"
      elementRef={buttonRef}
      role="button"
      tabIndex={0}
      aria-label={ariaLabel}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      cursor="pointer"
      background="secondary"
      borderWidth="small"
      borderRadius="medium"
      padding="medium"
      margin="small 0"
      display="block"
      position="relative"
      data-testid={`role-option-${role}`}
      themeOverride={{
        backgroundSecondary: '#FFFFFF',
        borderColorPrimary: '#C7CDD1',
      }}
      __dangerouslyIgnoreExperimentalWarnings
      css={{
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          backgroundColor: '#F5F5F5',
          borderColor: '#2D3B45',
          transform: 'translateY(-2px)',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        },
        '&:focus': {
          outline: '2px solid #0374B5',
          outlineOffset: '2px',
          borderColor: '#0374B5',
        },
        '&:active': {
          transform: 'translateY(0)',
          boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
        },
      }}
    >
      <Text size="large" weight="normal">
        {label}
      </Text>
    </View>
  )
}

export default RoleOption
