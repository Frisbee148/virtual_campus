# Implementation Plan: Role Selection Login

## Overview

This plan implements a role selection dialog on the existing Canvas LMS login page with role-specific dashboard routing. Users will select their role (Student, Faculty, Staff, Admin, Guardian/Parent, or HOD) before logging in, which will be stored in sessionStorage and used for frontend routing after authentication.

The implementation includes:
- Frontend role selection dialog and components
- Backend role-specific dashboard routes and controller actions
- Role-specific view templates and asset bundles
- Integration between frontend router and backend routes

## Tasks

- [x] 1. Identify and analyze existing login page structure
  - Locate the existing Canvas login page files (`app/views/login/canvas/_new_login_content.html.erb`)
  - Identify where React components are mounted in the login page
  - Document the existing login form structure and JavaScript initialization
  - Identify the authentication success handler for router integration
  - _Requirements: 6.1, 6.2, 6.3, 6.4_

- [x] 2. Create core TypeScript types and constants
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

- [-] 3. Implement sessionStorage utility functions
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

- [~] 4. Create RoleOption component
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

- [~] 5. Create RoleSelectionDialog component
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

- [~] 7. Create RoleIndicator component
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

- [~] 8. Create LoginPageContainer orchestration component
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

- [~] 9. Create frontend router utility
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

- [~] 10. Set up backend role-specific dashboard routes
  - [~] 10.1 Add role-specific routes in config/routes.rb
    - Add route for student dashboard: `get "dashboard/student" => "users#student_dashboard"`
    - Add route for faculty dashboard: `get "dashboard/faculty" => "users#faculty_dashboard"`
    - Add route for staff dashboard: `get "dashboard/staff" => "users#staff_dashboard"`
    - Add route for admin dashboard: `get "dashboard/admin" => "users#admin_dashboard"`
    - Add route for guardian dashboard: `get "dashboard/guardian" => "users#guardian_dashboard"`
    - Add route for HOD dashboard: `get "dashboard/hod" => "users#hod_dashboard"`
    - _Requirements: 5.2, 5.3_
  
  - [~] 10.2 Add controller actions in app/controllers/users_controller.rb
    - Identify the base `user_dashboard` method
    - Create `student_dashboard` action that sets `@dashboard_role = 'student'`
    - Create `faculty_dashboard` action that sets `@dashboard_role = 'faculty'`
    - Create `staff_dashboard` action that sets `@dashboard_role = 'staff'`
    - Create `admin_dashboard` action that sets `@dashboard_role = 'admin'`
    - Create `guardian_dashboard` action that sets `@dashboard_role = 'guardian'`
    - Create `hod_dashboard` action that sets `@dashboard_role = 'hod'`
    - Create shared `render_role_dashboard` private method
    - _Requirements: 5.2, 5.3_
  
  - [~] 10.3 Create role-specific view templates
    - Identify the base dashboard view template (e.g., `app/views/users/user_dashboard.html.erb`)
    - Copy base template to `app/views/users/student_dashboard.html.erb`
    - Copy base template to `app/views/users/faculty_dashboard.html.erb`
    - Copy base template to `app/views/users/staff_dashboard.html.erb`
    - Copy base template to `app/views/users/admin_dashboard.html.erb`
    - Copy base template to `app/views/users/guardian_dashboard.html.erb`
    - Copy base template to `app/views/users/hod_dashboard.html.erb`
    - Add role-specific body classes to each template
    - _Requirements: 5.2, 5.3_
  
  - [ ]* 10.4 Write integration tests for backend routes
    - Test each role-specific route renders correctly
    - Test routes require authentication
    - Test backward compatibility with base `/dashboard` route
    - _Requirements: 5.2, 5.3, 6.1_

- [~] 11. Set up frontend role-specific dashboard bundles
  - [~] 11.1 Create role-specific JavaScript entry points
    - Create directory structure: `ui/features/dashboard/student/`, `faculty/`, `staff/`, `admin/`, `guardian/`, `hod/`
    - Create `ui/features/dashboard/student/index.tsx` entry point
    - Create `ui/features/dashboard/faculty/index.tsx` entry point
    - Create `ui/features/dashboard/staff/index.tsx` entry point
    - Create `ui/features/dashboard/admin/index.tsx` entry point
    - Create `ui/features/dashboard/guardian/index.tsx` entry point
    - Create `ui/features/dashboard/hod/index.tsx` entry point
    - Each entry point imports shared dashboard components
    - _Requirements: 5.2, 5.3_
  
  - [~] 11.2 Create role-specific CSS bundles
    - Create `app/stylesheets/bundles/student_dashboard.scss`
    - Create `app/stylesheets/bundles/faculty_dashboard.scss`
    - Create `app/stylesheets/bundles/staff_dashboard.scss`
    - Create `app/stylesheets/bundles/admin_dashboard.scss`
    - Create `app/stylesheets/bundles/guardian_dashboard.scss`
    - Create `app/stylesheets/bundles/hod_dashboard.scss`
    - Each stylesheet imports base dashboard styles
    - Add role-specific style customizations
    - _Requirements: 5.2, 5.3, 8.1, 8.2_
  
  - [~] 11.3 Configure webpack for new bundles
    - Update webpack configuration to build student_dashboard bundle
    - Update webpack configuration to build faculty_dashboard bundle
    - Update webpack configuration to build staff_dashboard bundle
    - Update webpack configuration to build admin_dashboard bundle
    - Update webpack configuration to build guardian_dashboard bundle
    - Update webpack configuration to build hod_dashboard bundle
    - Verify bundles build successfully with `yarn build`
    - _Requirements: 5.2, 5.3_
  
  - [~] 11.4 Update view templates to load role-specific bundles
    - Update `student_dashboard.html.erb` to load `js_bundle :student_dashboard` and `css_bundle :student_dashboard`
    - Update `faculty_dashboard.html.erb` to load `js_bundle :faculty_dashboard` and `css_bundle :faculty_dashboard`
    - Update `staff_dashboard.html.erb` to load `js_bundle :staff_dashboard` and `css_bundle :staff_dashboard`
    - Update `admin_dashboard.html.erb` to load `js_bundle :admin_dashboard` and `css_bundle :admin_dashboard`
    - Update `guardian_dashboard.html.erb` to load `js_bundle :guardian_dashboard` and `css_bundle :guardian_dashboard`
    - Update `hod_dashboard.html.erb` to load `js_bundle :hod_dashboard` and `css_bundle :hod_dashboard`
    - _Requirements: 5.2, 5.3_

- [~] 12. Integrate role-specific routing with loginRouter
  - [~] 12.1 Update loginRouter.ts to use role-specific routes
    - Verify `ROLE_ROUTES` constant includes all six role-specific routes
    - Ensure `navigateAfterLogin` function uses the role-specific routes
    - Test navigation to each role-specific dashboard after login
    - _Requirements: 5.1, 5.2, 5.3_
  
  - [ ]* 12.2 Write integration tests for role-specific navigation
    - Test student role navigates to `/dashboard/student`
    - Test faculty role navigates to `/dashboard/faculty`
    - Test staff role navigates to `/dashboard/staff`
    - Test admin role navigates to `/dashboard/admin`
    - Test guardian role navigates to `/dashboard/guardian`
    - Test HOD role navigates to `/dashboard/hod`
    - Test no role navigates to `/dashboard` (default)
    - Test sessionStorage is cleared after navigation
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 3.4_

- [x] 13. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [~] 14. Integrate components into existing login page
  - [x] 14.1 Modify login page ERB template
    - Add React mount point for LoginPageContainer in `app/views/login/canvas/_new_login_content.html.erb`
    - Ensure mount point doesn't obscure existing login fields
    - Preserve all existing template functionality
    - _Requirements: 1.4, 6.1_
  
  - [x] 14.2 Create entry point JavaScript file
    - Create `ui/features/login/index.tsx` if it doesn't exist
    - Import and mount LoginPageContainer component
    - Add error boundary for graceful failure handling
    - _Requirements: 6.1_
  
  - [x] 14.3 Hook router into authentication success handler
    - Locate existing authentication success callback
    - Call `navigateAfterLogin` after successful authentication
    - Ensure role is cleared from sessionStorage after navigation
    - _Requirements: 3.4, 5.1_

- [~] 15. Add responsive styling and Canvas theme integration
  - [x] 15.1 Create component styles with brandable CSS
    - Use Canvas brandable CSS variables for colors
    - Use Canvas spacing and typography patterns
    - Implement responsive breakpoints for mobile/tablet/desktop
    - Ensure dialog doesn't obscure login fields on small screens
    - _Requirements: 1.4, 8.1, 8.2, 8.3_
  
  - [ ]* 15.2 Write integration tests for styling
    - Test dialog uses Canvas theme variables
    - Test responsive behavior at different viewports
    - Test dialog positioning doesn't obscure fields
    - _Requirements: 8.1, 8.2, 8.3, 8.4_

- [~] 16. Add comprehensive error handling
  - [x] 16.1 Implement error boundaries and fallbacks
    - Add Error Boundary around LoginPageContainer
    - Implement fallback UI for component errors
    - Add console logging for debugging
    - Ensure login works even if role selection fails
    - _Requirements: 6.1, 6.2, 6.3_
  
  - [ ]* 16.2 Write unit tests for error scenarios
    - Test sessionStorage unavailable scenario
    - Test component rendering errors
    - Test invalid role in storage
    - Test missing route configuration
    - _Requirements: 6.1, 6.2, 6.3_

- [ ] 17. Final integration testing
  - [ ]* 17.1 Write integration tests for complete flow
    - Test full role selection and login flow
    - Test role persistence across authentication failures
    - Test role clearing on successful authentication
    - Test existing login functionality preserved
    - Test accessibility with keyboard navigation
    - Test navigation to each role-specific dashboard
    - Test role-specific dashboards render correctly
    - Test backward compatibility with base dashboard
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 3.1, 3.2, 3.3, 3.4, 5.2, 5.3, 5.4, 6.1, 6.2, 6.3, 6.4, 7.1, 7.2, 7.3, 7.4, 7.5_

- [x] 18. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Implementation includes both frontend (React components, routing) and backend (Rails routes, controllers, views)
- All existing login functionality must be preserved
- Role-specific dashboards initially duplicate base dashboard functionality
- Property tests validate universal correctness properties from the design
- Unit tests validate specific examples and edge cases
- Integration tests ensure compatibility with existing Canvas systems
- Backward compatibility maintained with base `/dashboard` route
