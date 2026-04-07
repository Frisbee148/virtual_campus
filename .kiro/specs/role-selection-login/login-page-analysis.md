# Login Page Structure Analysis

## Task 1: Identify and Analyze Existing Login Page Structure

**Date**: Analysis completed for role-selection-login spec
**Requirements Validated**: 6.1, 6.2, 6.3, 6.4

---

## 1. Login Page File Location

### Primary Template File
**Path**: `app/views/login/canvas/_new_login_content.html.erb`

**Purpose**: Main ERB template for Canvas login page containing the login form structure

**Key Characteristics**:
- Rails ERB partial template
- Contains two forms: main login form (`#login_form`) and forgot password form (`#forgot_password_form`)
- Uses Canvas InstUI CSS classes (`.ic-Login`, `.ic-Form-control`, etc.)
- Supports theme editor preview mode
- Includes SSO button rendering via partial

---

## 2. Login Form Structure

### Main Login Form (`#login_form`)

**Form ID**: `login_form`
**Action**: POST to `create` action (handled by `Login::CanvasController#create`)
**Form Object**: `:pseudonym_session`

**Form Fields**:
1. **Unique ID Field** (username/email)
   - Field name: `pseudonym_session[unique_id]`
   - CSS class: `.ic-Input.text`
   - Label: Dynamic based on `login_handle_name` (typically "Email" or "Username")
   - Autofocus: Enabled (unless previewing from theme editor)

2. **Password Field**
   - Field name: `pseudonym_session[password]`
   - CSS class: `.ic-Input.text`
   - Type: `password`
   - Role: `textbox`

3. **Remember Me Checkbox** (conditional)
   - Field name: `pseudonym_session[remember_me]`
   - Only shown if session timeout is not enabled

4. **Hidden Fields**:
   - `redirect_to_ssl`: Always set to "1"

5. **Submit Button**
   - CSS class: `.Button.Button--login`
   - Text: "Log In" (i18n: `t('log_in', 'Log In')`)
   - Type: Dynamic (`submit` or `button` based on preview mode)

### Forgot Password Form (`#forgot_password_form`)

**Form ID**: `forgot_password_form`
**Initial State**: Hidden (`display: none`)
**Action**: POST to `forgot_password_path`

**Form Fields**:
1. **Email/Username Field**
   - Field name: `pseudonym_session[unique_id_forgot]`
   - CSS class: `.ic-Input.email_address.text`

---

## 3. JavaScript Initialization

### Primary JavaScript File
**Path**: `ui/features/login/index.ts`

**Initialization Timing**: Uses `@instructure/ready` (DOM ready handler)

### Key JavaScript Behaviors

1. **Form Validation** (`#login_form.submit`):
   - Validates unique_id is not empty
   - Validates password is not empty
   - Shows form errors using jQuery `.formErrors()` method
   - Disables submit button on successful validation to prevent double-submit

2. **Forgot Password Form** (`#forgot_password_form.formSubmit`):
   - Uses jQuery `.formSubmit()` plugin
   - Validates `unique_id_forgot` field is required
   - Shows loading image during submission
   - Displays flash message on success (15-minute timeout)
   - Focuses on close button of alert for accessibility

3. **Form Switching**:
   - `.forgot_password_link` click: Hides login form, shows forgot password form
   - `.login_link` click: Hides forgot password form, shows login form
   - Both manage focus for accessibility

4. **Session Storage Clearing**:
   - Clears `sessionStorage` on page load
   - **Exception**: Does NOT clear if `.ic-Login--previewing` class is present (theme editor mode)

5. **Parent Signup Dialog**:
   - Handles `#coenrollment_link` clicks
   - Dynamically loads signup dialog module

6. **Fancy Placeholders**:
   - Applies `.fancyPlaceholder()` to fields with `.field-with-fancyplaceholder` class

---

## 4. React Component Mounting

### Current State: **NO REACT COMPONENTS**

**Finding**: The existing login page does NOT currently mount any React components.

**Evidence**:
- No `ReactDOM.render()` or `createRoot()` calls in `ui/features/login/index.ts`
- No React component files in `ui/features/login/` directory
- No `react` subdirectory exists under `ui/features/login/`

### Canvas React Mounting Convention

Based on analysis of other Canvas features, the standard pattern is:

```typescript
import {createRoot} from 'react-dom/client'

// Create mount point (either existing in DOM or created dynamically)
const mountPoint = document.getElementById('mount-point-id')

// Create React root
const root = createRoot(mountPoint)

// Render component
root.render(<Component {...props} />)

// Cleanup (when needed)
root.unmount()
```

**Common Patterns**:
- Mount points are typically `<div>` elements with specific IDs
- Mount points can be pre-existing in ERB templates or created dynamically
- Roots are often stored as instance variables for later unmounting
- Components are imported from `ui/features/{feature}/react/` directories

---

## 5. Authentication Success Handler

### Backend Flow

**Controller**: `app/controllers/login/canvas_controller.rb`
**Method**: `Login::CanvasController#create`

**Authentication Process**:
1. Validates CSRF token
2. Resets session ID to prevent session fixation
3. Attempts authentication via PseudonymSession
4. Handles LDAP authentication if configured
5. Checks for login errors (too many attempts, invalid credentials, etc.)
6. Calls `successful_login(user, pseudonym)` on success

### Successful Login Handler

**Module**: `app/controllers/login/shared.rb`
**Method**: `Login::Shared#successful_login`

**Redirect Logic** (in priority order):

1. **OAuth Flow** (`session[:oauth2]` present):
   - Redirects to OAuth confirmation page
   - Uses `Canvas::OAuth::Provider.confirmation_redirect`

2. **Course Claim Flow** (`session[:course_uuid]` present):
   - Redirects to course URL with `login_success=1` param
   - Claims course for user

3. **Registration Confirmation** (`session[:confirm]` present):
   - Redirects to `registration_confirmation_path`
   - Includes enrollment and confirmation params

4. **Default Flow** (most common):
   - Redirects to `session[:return_to]` if present
   - Falls back to `dashboard_url(login_success: "1")`
   - Uses `redirect_back_or_default` helper

**Key Observations**:
- Redirect happens via Rails `redirect_to` (server-side redirect)
- No client-side JavaScript routing after authentication
- `login_success=1` query parameter is added to default redirect
- Session storage is NOT used for post-login routing decisions

### Return URL Setting

**Method**: `Login::Shared.set_return_to_from_provider`

**Behavior**:
- Sets `session[:return_to]` from provider-supplied URL
- Validates URL scheme and host for security
- Supports cross-domain redirects with session tokens
- Only allows absolute paths or trusted domains

---

## 6. Integration Points for Role Selection

### Recommended Mount Points in ERB Template

Based on the analysis, the following locations are suitable for React component mounting:

#### Option 1: Before Login Form (Recommended)
**Location**: Inside `.ic-Login__body`, before the `form_for` block
**Rationale**: 
- Dialog can overlay the entire login area
- Doesn't interfere with existing form structure
- Follows Canvas pattern of mounting components at container level

```erb
<div class="ic-Login__body">
  <%= render "shared/login_fft_helper" %>
  
  <!-- NEW: Role Selection Dialog Mount Point -->
  <div id="role-selection-dialog-mount"></div>
  
  <%= form_for :pseudonym_session, ... %>
```

#### Option 2: After Login Header
**Location**: After `.ic-Login-header`, before `.ic-Login__body`
**Rationale**:
- Separates role selection from form area
- Could display role indicator in header area

### JavaScript Initialization Location

**File**: `ui/features/login/index.ts`
**Location**: Inside the `ready()` callback, after sessionStorage.clear()

**Recommended Pattern**:
```typescript
ready(() => {
  // ... existing code ...
  
  // do not clear session storage if previewing via the theme editor
  if (!document.querySelector('.ic-Login--previewing')) {
    sessionStorage.clear()
  }
  
  // NEW: Mount role selection components
  const roleDialogMount = document.getElementById('role-selection-dialog-mount')
  if (roleDialogMount) {
    import('./react/LoginPageContainer').then(({default: LoginPageContainer}) => {
      const root = createRoot(roleDialogMount)
      root.render(<LoginPageContainer />)
    })
  }
})
```

---

## 7. Router Integration Strategy

### Current State: No Frontend Router

**Finding**: Canvas does NOT use a client-side router for post-authentication navigation.

**Current Behavior**:
- Server-side redirect via Rails `redirect_to`
- Redirect URL determined by `successful_login` method
- No JavaScript-based routing after authentication

### Recommended Approach for Role-Based Routing

Since the design document specifies "Frontend Router" integration, we need to create a new routing mechanism:

#### Option A: Intercept Form Submission (Recommended)

**Strategy**: Intercept the login form submission, perform authentication via AJAX, then route based on role

**Implementation Location**: `ui/features/login/index.ts`

**Pseudocode**:
```typescript
$('#login_form').submit(function(event) {
  // Existing validation...
  
  if (success) {
    event.preventDefault() // Prevent default form submission
    
    // Perform AJAX authentication
    $.ajax({
      url: $(this).attr('action'),
      method: 'POST',
      data: $(this).serialize(),
      success: (response) => {
        // Read role from sessionStorage
        const role = sessionStorage.getItem('canvas_selected_role')
        
        // Navigate based on role
        const targetUrl = getRoleBasedUrl(role) || response.location
        window.location.href = targetUrl
      }
    })
  }
})
```

**Challenges**:
- Requires modifying existing authentication flow
- May conflict with CSRF protection
- Needs to handle all authentication edge cases (MFA, terms acceptance, etc.)

#### Option B: Post-Redirect JavaScript Router (Alternative)

**Strategy**: Let server redirect to dashboard, then use JavaScript to re-route based on role

**Implementation Location**: Dashboard page JavaScript

**Pseudocode**:
```typescript
// On dashboard page load
if (window.location.search.includes('login_success=1')) {
  const role = sessionStorage.getItem('canvas_selected_role')
  if (role) {
    sessionStorage.removeItem('canvas_selected_role')
    const targetUrl = getRoleBasedUrl(role)
    if (targetUrl !== window.location.pathname) {
      window.location.href = targetUrl
    }
  }
}
```

**Challenges**:
- Causes double-redirect (server redirect, then client redirect)
- Brief flash of dashboard before re-routing
- Requires modifying dashboard page

#### Option C: Server-Side Role Routing (Simplest)

**Strategy**: Pass role to server, let server handle routing

**Implementation**: Add hidden field to login form with selected role

**Pseudocode**:
```typescript
// When role is selected
const roleInput = document.createElement('input')
roleInput.type = 'hidden'
roleInput.name = 'selected_role'
roleInput.value = selectedRole
document.getElementById('login_form').appendChild(roleInput)
```

**Server-side** (in `successful_login`):
```ruby
if params[:selected_role].present?
  redirect_target = role_based_dashboard_url(params[:selected_role])
end
```

**Challenges**:
- Requires backend changes (contradicts "frontend-only" requirement)
- Simpler and more reliable than client-side routing

---

## 8. Accessibility Considerations

### Existing Accessibility Features

1. **Semantic HTML**:
   - Proper `<form>` elements
   - `<label>` elements with `for` attributes
   - Hidden heading for screen readers: `<h1 class="ui-helper-hidden-accessible">`

2. **Keyboard Navigation**:
   - Autofocus on first input field
   - Focus management when switching between forms
   - Focus on alert close button after forgot password submission

3. **ARIA Attributes**:
   - `aria-describedby` on forgot password email field
   - `role="textbox"` on password field
   - `role="contentinfo"` on footer

4. **Screen Reader Support**:
   - Hidden accessible headings
   - Proper form labels
   - Flash messages with appropriate timeouts

### Requirements for Role Selection Dialog

Based on Requirements 7.1-7.5, the role selection dialog must:

1. Support Tab and Arrow key navigation
2. Provide visible focus indicators
3. Handle Enter/Space key for selection
4. Include ARIA labels for each role option
5. Set focus to first role option on open

**Recommendation**: Use InstUI Modal component, which provides these features out-of-the-box.

---

## 9. Styling and Theme Integration

### Existing CSS Classes

**Login Container Classes**:
- `.ic-Login`: Main container
- `.ic-Login__container`: Inner container
- `.ic-Login__content`: Content wrapper
- `.ic-Login__innerContent`: Inner content wrapper
- `.ic-Login__body`: Form body area
- `.ic-Login__header`: Header area
- `.ic-Login__footer`: Footer area

**Form Control Classes**:
- `.ic-Form-control`: Form field wrapper
- `.ic-Form-control--login`: Login-specific form control
- `.ic-Input`: Input field styling
- `.ic-Label`: Label styling
- `.Button.Button--login`: Login button styling

### Theme Editor Support

**Preview Mode**: `params[:previewing_from_themeeditor]`
**CSS Class**: `.ic-Login--previewing`

**Behavior**:
- Changes button types from `submit` to `button`
- Disables autofocus
- Prevents sessionStorage clearing

**Requirement**: Role selection dialog must respect preview mode and not interfere with theme editor functionality.

### Brandable CSS

**Requirement 8.1**: Use Canvas LMS brandable CSS theme variables

**Recommendation**: Use InstUI components which automatically use Canvas theme variables.

---

## 10. Summary and Recommendations

### Key Findings

1. **No Existing React Components**: Login page is currently jQuery-based with no React components
2. **No Client-Side Router**: Authentication uses server-side redirects
3. **SessionStorage Cleared on Load**: Current behavior clears sessionStorage (except in preview mode)
4. **Strong Accessibility Foundation**: Existing page has good accessibility practices
5. **InstUI CSS Classes**: Page uses Canvas InstUI styling conventions

### Recommended Implementation Approach

1. **Create React Component Directory**: `ui/features/login/react/`
2. **Add Mount Point to ERB**: Insert `<div id="role-selection-dialog-mount"></div>` in `.ic-Login__body`
3. **Initialize in index.ts**: Mount React components after sessionStorage handling
4. **Use InstUI Modal**: Leverage Canvas's InstUI Modal component for dialog
5. **Modify SessionStorage Clearing**: Preserve `canvas_selected_role` key when clearing storage
6. **Implement Client-Side Routing**: Use Option A (intercept form submission) or Option B (post-redirect routing)

### Files to Create

1. `ui/features/login/react/LoginPageContainer.tsx` - Main orchestrator component
2. `ui/features/login/react/RoleSelectionDialog.tsx` - Modal dialog component
3. `ui/features/login/react/RoleOption.tsx` - Individual role option component
4. `ui/features/login/react/RoleIndicator.tsx` - Selected role display component
5. `ui/shared/util/loginRouter.ts` - Role-based routing logic

### Files to Modify

1. `app/views/login/canvas/_new_login_content.html.erb` - Add React mount points
2. `ui/features/login/index.ts` - Initialize React components and handle routing
3. `ui/features/login/package.json` - Add React dependencies if needed

### Critical Considerations

1. **SessionStorage Clearing**: Must modify the `sessionStorage.clear()` logic to preserve role selection
2. **Theme Editor Compatibility**: Role selection must not activate in preview mode
3. **Authentication Flow**: Decide between client-side routing (requires AJAX) vs. server-side routing (requires backend changes)
4. **Accessibility**: Must maintain existing accessibility standards and add new ones for dialog
5. **Error Handling**: Must preserve existing error handling for authentication failures

---

## Appendix: Code References

### Login Form Submit Handler
**File**: `ui/features/login/index.ts`
**Lines**: 74-103

### Successful Login Method
**File**: `app/controllers/login/shared.rb`
**Lines**: 88-177

### Login Page Template
**File**: `app/views/login/canvas/_new_login_content.html.erb`
**Lines**: 1-127

### Canvas React Mounting Pattern
**Example**: `ui/features/profile/jquery/communication_channels.jsx`
**Pattern**: `createRoot()` from `react-dom/client`
