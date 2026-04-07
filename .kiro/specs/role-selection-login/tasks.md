# Implementation Plan: Role Selection Login

## Overview

This plan implements a role selection dialog on the existing Canvas LMS login page. The implementation is frontend-only, modifying the existing login page at `app/views/login/canvas/_new_login_content.html.erb` to add role selection functionality. Users will select their role (Student, Faculty, Staff, Admin, Guardian/Parent, or HOD) before logging in, which will be stored in sessionStorage and used for frontend routing after authentication.

## Tasks

- [x] 1. Identify and analyze existing login page structure
  - Locate the existing Canvas login page files (`app/views/login/canvas/_new_login_content.html.erb`)
  - Identify where React components are mounted in the login page
  - Document the existing login form structure and JavaScript initialization
  - Identify the authentication success handler for router integration
  - _Requirements: 6.1, 6.2, 6.3, 6.4_

- [ ] 2. Create core TypeScript types and constants
  - [x] 2.1 Create types file with UserRole type and interfaces
    - Define `UserRole` type with six role values
    - Define `RoleDisplayInfo` interface for role metadata
    - Define `RoleRouteMap` interface for routing configuration
    - Create `ROLE_ROUTES` constant with route mappings
    - Create `ROLE_DISPLAY_INFO` constant with labels and ARIA text
    - _Requirements: 1.2, 5.3, 7.4_
  
  - [ ]* 2.2 Write property test for role type validation
    - **Property 2: SessionStorage round-trip preserves role**
    - **Validates: Requirements 3.1, 3.2**

- [ ] 3. Implement sessionStorage utility functions
  - [x] 3.1 Create sessionStorage helper module
    - Write `safeSetSessionStorage` function with error handling
    - Write `safeGetSessionStorage` function with validation
    - Write `clearRoleSelection` function
    - Write `validateRole` function to check valid role values
    - _Requirements: 2.3, 3.1, 3.2, 3.4_
  
  - [ ]* 3.2 Write unit tests for sessionStorage utilities
    - Test successful storage operations
    - Test storage quota exceeded scenario
    - Test invalid role value handling
    - Test storage unavailable fallback
    - _Requirements: 2.3, 3.1, 3.2_

- [ ] 4. Create RoleOption component
  - [x] 4.1 Implement RoleOption component with accessibility
    - Create component file at `ui/features/login/react/RoleOption.tsx`
    - Implement click handler for role selection
    - Implement keyboard handler for Enter/Space keys
    - Add ARIA labels and role attributes
    - Add focus management with visible focus indicator
    - Style using Canvas InstUI patterns
    - _Requirements: 1.3, 7.1, 7.2, 7.3, 7.4_
  
  - [ ]* 4.2 Write property test for keyboard navigation
    - **Property 6: Keyboard navigation selects roles**
    - **Validates: Requirements 7.3**
  
  - [ ]* 4.3 Write property test for focus indicators
    - **Property 7: Focus indicators present for all roles**
    - **Validates: Requirements 7.2**
  
  - [ ]* 4.4 Write property test for ARIA labels
    - **Property 8: ARIA labels present for all roles**
    - **Validates: Requirements 7.4**

- [ ] 5. Create RoleSelectionDialog component
  - [x] 5.1 Implement modal dialog with InstUI
    - Create component file at `ui/features/login/react/RoleSelectionDialog.tsx`
    - Use InstUI Modal component for dialog structure
    - Render six RoleOption components
    - Implement onRoleSelect callback handler
    - Set focus to first role option on open
    - Handle dialog close on role selection
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 2.1, 2.2, 7.5_
  
  - [ ]* 5.2 Write property test for role selection behavior
    - **Property 1: Role selection updates state and closes dialog**
    - **Validates: Requirements 2.1, 2.2, 2.3, 2.4**
  
  - [ ]* 5.3 Write unit tests for dialog component
    - Test dialog renders with all six roles
    - Test dialog closes after selection
    - Test focus management on open
    - Test keyboard navigation between options
    - _Requirements: 1.1, 1.2, 2.2, 7.5_

- [x] 6. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 7. Create RoleIndicator component
  - [x] 7.1 Implement role indicator with change button
    - Create component file at `ui/features/login/react/RoleIndicator.tsx`
    - Display currently selected role with label
    - Add "Change Role" button to reopen dialog
    - Hide component when no role is selected
    - Style using Canvas brandable CSS variables
    - _Requirements: 4.1, 4.2, 8.1, 8.2_
  
  - [ ]* 7.2 Write unit tests for role indicator
    - Test indicator displays selected role
    - Test change button triggers dialog reopen
    - Test indicator hidden when no role selected
    - _Requirements: 4.1, 4.2_

- [ ] 8. Create LoginPageContainer orchestration component
  - [x] 8.1 Implement container component with state management
    - Create component file at `ui/features/login/react/LoginPageContainer.tsx`
    - Initialize state from sessionStorage on mount
    - Manage dialog open/close state
    - Handle role selection and storage updates
    - Control login form enabled state
    - Implement role change handler
    - _Requirements: 2.3, 2.4, 3.1, 3.2, 3.3, 4.3, 4.4_
  
  - [ ]* 8.2 Write property test for dialog visibility logic
    - **Property 3: Dialog visibility respects sessionStorage state**
    - **Validates: Requirements 3.3**
  
  - [ ]* 8.3 Write property test for role update idempotency
    - **Property 4: Role selection updates are idempotent for storage**
    - **Validates: Requirements 4.4**
  
  - [ ]* 8.4 Write unit tests for container component
    - Test initialization with existing role in storage
    - Test initialization without role in storage
    - Test form enabling after role selection
    - Test role change flow
    - _Requirements: 2.4, 3.2, 3.3, 4.3_

- [ ] 9. Create frontend router utility
  - [x] 9.1 Implement post-authentication routing logic
    - Create utility file at `ui/shared/util/loginRouter.ts`
    - Implement `navigateAfterLogin` function
    - Read role from sessionStorage
    - Map role to route using ROLE_ROUTES
    - Navigate to role-specific page or default
    - Handle missing or invalid role gracefully
    - _Requirements: 5.1, 5.2, 5.3, 5.4_
  
  - [ ]* 9.2 Write property test for router navigation
    - **Property 5: Router navigates based on role**
    - **Validates: Requirements 5.2**
  
  - [ ]* 9.3 Write unit tests for router utility
    - Test navigation for each role
    - Test default navigation when no role
    - Test handling of invalid role values
    - _Requirements: 5.2, 5.3, 5.4_

- [x] 10. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 11. Integrate components into existing login page
  - [x] 11.1 Modify login page ERB template
    - Add React mount point for LoginPageContainer in `app/views/login/canvas/_new_login_content.html.erb`
    - Ensure mount point doesn't obscure existing login fields
    - Preserve all existing template functionality
    - _Requirements: 1.4, 6.1_
  
  - [x] 11.2 Create entry point JavaScript file
    - Create `ui/features/login/index.tsx` if it doesn't exist
    - Import and mount LoginPageContainer component
    - Add error boundary for graceful failure handling
    - _Requirements: 6.1_
  
  - [x] 11.3 Hook router into authentication success handler
    - Locate existing authentication success callback
    - Call `navigateAfterLogin` after successful authentication
    - Ensure role is cleared from sessionStorage after navigation
    - _Requirements: 3.4, 5.1_

- [ ] 12. Add responsive styling and Canvas theme integration
  - [x] 12.1 Create component styles with brandable CSS
    - Use Canvas brandable CSS variables for colors
    - Use Canvas spacing and typography patterns
    - Implement responsive breakpoints for mobile/tablet/desktop
    - Ensure dialog doesn't obscure login fields on small screens
    - _Requirements: 1.4, 8.1, 8.2, 8.3_
  
  - [ ]* 12.2 Write integration tests for styling
    - Test dialog uses Canvas theme variables
    - Test responsive behavior at different viewports
    - Test dialog positioning doesn't obscure fields
    - _Requirements: 8.1, 8.2, 8.3, 8.4_

- [ ] 13. Add comprehensive error handling
  - [x] 13.1 Implement error boundaries and fallbacks
    - Add Error Boundary around LoginPageContainer
    - Implement fallback UI for component errors
    - Add console logging for debugging
    - Ensure login works even if role selection fails
    - _Requirements: 6.1, 6.2, 6.3_
  
  - [ ]* 13.2 Write unit tests for error scenarios
    - Test sessionStorage unavailable scenario
    - Test component rendering errors
    - Test invalid role in storage
    - Test missing route configuration
    - _Requirements: 6.1, 6.2, 6.3_

- [ ] 14. Final integration testing
  - [ ]* 14.1 Write integration tests for complete flow
    - Test full role selection and login flow
    - Test role persistence across authentication failures
    - Test role clearing on successful authentication
    - Test existing login functionality preserved
    - Test accessibility with keyboard navigation
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 3.1, 3.2, 3.3, 3.4, 6.1, 6.2, 6.3, 6.4, 7.1, 7.2, 7.3, 7.4, 7.5_

- [x] 15. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- This is a frontend-only modification to the existing Canvas login page
- All existing login functionality must be preserved
- Property tests validate universal correctness properties from the design
- Unit tests validate specific examples and edge cases
- Integration tests ensure compatibility with existing Canvas systems
