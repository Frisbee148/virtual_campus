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
import {Modal} from '@instructure/ui-modal'
import {Heading} from '@instructure/ui-heading'
import {View} from '@instructure/ui-view'
import RoleOption from './RoleOption'
import {ROLE_DISPLAY_INFO, type UserRole} from './types'

/**
 * Props for the RoleSelectionDialog component
 * Validates: Requirements 1.1, 1.2, 2.1, 2.2, 7.5
 */
export interface RoleSelectionDialogProps {
  isOpen: boolean
  onRoleSelect: (role: UserRole) => void
}

/**
 * RoleSelectionDialog Component
 * 
 * Modal dialog that displays six role options for user selection.
 * Uses InstUI Modal component for consistent Canvas styling and accessibility.
 * 
 * Validates: Requirements 1.1, 1.2, 1.3, 1.4, 2.1, 2.2, 7.5
 */
const RoleSelectionDialog: React.FC<RoleSelectionDialogProps> = ({isOpen, onRoleSelect}) => {
  /**
   * Handle role selection
   * Validates: Requirements 2.1, 2.2
   */
  const handleRoleSelect = (role: UserRole) => {
    onRoleSelect(role)
  }

  // Array of all six roles in order
  const roles: UserRole[] = ['student', 'faculty', 'staff', 'admin', 'guardian', 'hod']

  return (
    <Modal
      open={isOpen}
      onDismiss={() => {}}
      size="small"
      label="Select Your Role"
      shouldCloseOnDocumentClick={false}
      data-testid="role-selection-dialog"
    >
      <Modal.Header>
        <Heading level="h2">Select Your Role</Heading>
      </Modal.Header>
      <Modal.Body>
        <View as="div" padding="small 0">
          {roles.map((role, index) => {
            const displayInfo = ROLE_DISPLAY_INFO[role]
            return (
              <RoleOption
                key={role}
                role={role}
                label={displayInfo.label}
                ariaLabel={displayInfo.ariaLabel}
                onClick={handleRoleSelect}
                isFirst={index === 0}
              />
            )
          })}
        </View>
      </Modal.Body>
    </Modal>
  )
}

export default RoleSelectionDialog
