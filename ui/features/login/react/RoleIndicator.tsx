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
import {View} from '@instructure/ui-view'
import {Text} from '@instructure/ui-text'
import {Button} from '@instructure/ui-buttons'
import {Flex} from '@instructure/ui-flex'
import {ROLE_DISPLAY_INFO, type UserRole} from './types'

/**
 * Props for the RoleIndicator component
 * Validates: Requirements 4.1, 4.2, 8.1, 8.2
 */
export interface RoleIndicatorProps {
  selectedRole: UserRole | null
  onChangeRole: () => void
}

/**
 * RoleIndicator Component
 * 
 * Displays the currently selected role with a button to change it.
 * Hidden when no role is selected.
 * Uses Canvas brandable CSS variables for consistent styling.
 * 
 * Validates: Requirements 4.1, 4.2, 8.1, 8.2
 */
const RoleIndicator: React.FC<RoleIndicatorProps> = ({selectedRole, onChangeRole}) => {
  // Hide component when no role is selected
  if (!selectedRole) {
    return null
  }

  const displayInfo = ROLE_DISPLAY_INFO[selectedRole]

  return (
    <View
      as="div"
      padding="small"
      background="secondary"
      borderWidth="small"
      borderRadius="medium"
      margin="0 0 medium 0"
      data-testid="role-indicator"
      themeOverride={{
        backgroundSecondary: '#F5F5F5',
        borderColorPrimary: '#C7CDD1',
      }}
      __dangerouslyIgnoreExperimentalWarnings
    >
      <Flex justifyItems="space-between" alignItems="center">
        <Flex.Item shouldGrow={true}>
          <Flex direction="column" gap="xx-small">
            <Flex.Item>
              <Text size="small" weight="bold" color="secondary">
                Selected Role
              </Text>
            </Flex.Item>
            <Flex.Item>
              <Text size="medium" weight="normal">
                {displayInfo.label}
              </Text>
            </Flex.Item>
          </Flex>
        </Flex.Item>
        <Flex.Item>
          <Button
            onClick={onChangeRole}
            size="small"
            color="secondary"
            data-testid="change-role-button"
          >
            Change Role
          </Button>
        </Flex.Item>
      </Flex>
    </View>
  )
}

export default RoleIndicator
