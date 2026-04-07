/*
 * Copyright (C) 2014 - present Instructure, Inc.
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

import $ from 'jquery'
import ready from '@instructure/ready'
import {useScope as createI18nScope} from '@canvas/i18n'
import htmlEscape from '@instructure/html-escape'
import {loadSignupDialog} from '@canvas/signup-dialog'
import 'jquery-fancy-placeholder' /* fancyPlaceholder */
import '@canvas/jquery/jquery.instructure_forms' /* formSubmit, getFormData, formErrors, errorBox */
import '@canvas/loading-image'
import '@canvas/rails-flash-notifications'

const I18n = createI18nScope('pseudonyms.login')

ready(() => {
  $('#coenrollment_link').click(function (event) {
    event.preventDefault()
    const template = $(this).data('template')
    const path = $(this).data('path')
    loadSignupDialog
      .then((signupDialog: (id: string, title: string, path: string) => void) => {
        signupDialog(template, I18n.t('parent_signup', 'Parent Signup'), path)
      })
      .catch((error: Error) => {
        throw new Error('Failed to load signup dialog', error)
      })
  })

  $('.field-with-fancyplaceholder input').fancyPlaceholder()
  $('#forgot_password_form').formSubmit({
    object_name: 'pseudonym_session',
    required: ['unique_id_forgot'],
    beforeSubmit(_data) {
      $(this).loadingImage()
    },
    success(_data) {
      $(this).loadingImage('remove')
      $.flashMessage(
        htmlEscape(
          I18n.t(
            'Your password recovery instructions will be sent to *%{email_address}*. This may take up to 30 minutes. Make sure to check your spam box.',
            {
              wrappers: ['<b>$1</b>'],
              email_address: $(this).find('.email_address').val(),
            },
          ),
        ),
        15 * 60 * 1000, // fifteen minutes isn't forever but should be plenty
      )
      // Focus on the close button of the alert we just put up, per a11y
      $('#flash_message_holder button.close_link').focus()
    },
    error(_data: JQuery.jqXHR) {
      $(this).loadingImage('remove')
    },
  })

  $('#login_form').submit(function (event) {
    const data = $(this).getFormData<
      Partial<{
        unique_id: string
        password: string
      }>
    >({object_name: 'pseudonym_session'})
    let success = true
    if (!data.unique_id || data.unique_id.length < 1) {
      $(this).formErrors({
        unique_id: I18n.t('invalid_login', 'Invalid login'),
      })
      success = false
    } else if (!data.password || data.password.length < 1) {
      $(this).formErrors({
        password: I18n.t('invalid_password', 'Invalid password'),
      })
      success = false
    }

    if (success) {
      // Prevent default form submission to handle with AJAX
      event.preventDefault()
      
      // disable the button to avoid double-submit
      const $btn = $(this).find('input[type="submit"]')
      $btn.val($btn.data('disable-with'))
      $btn.prop('disabled', true)
      
      const $form = $(this)
      
      // Submit form via fetch API to properly handle redirects
      fetch($form.attr('action') || '/login/canvas', {
        method: 'POST',
        body: new URLSearchParams($form.serialize()),
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: 'manual' // Don't follow redirects automatically
      }).then(response => {
        if (response.type === 'opaqueredirect' || response.status === 302 || response.status === 303) {
          // Successful authentication - server is redirecting
          // Use role-based routing instead of following server redirect
          import('../../shared/util/loginRouter').then(module => {
            module.navigateAfterLogin()
          }).catch((error: Error) => {
            console.error('Failed to load loginRouter:', error)
            // Fallback to default dashboard if router fails
            window.location.href = '/dashboard'
          })
        } else {
          // Authentication failed - reload page to show errors
          window.location.reload()
        }
      }).catch(error => {
        console.error('Login submission error:', error)
        // Reload page on error
        window.location.reload()
      })
    }

    return false
  })

  const $loginForm = $('#login_form')
  const $forgotPasswordForm = $('#forgot_password_form')

  $('.forgot_password_link').click(event => {
    event.preventDefault()
    $loginForm.hide()
    $forgotPasswordForm.show()
    $forgotPasswordForm.find('input:visible:first').focus()
  })

  $('.login_link').click(event => {
    event.preventDefault()
    $forgotPasswordForm.hide()
    $loginForm.show()
    $loginForm.find('input:visible:first').focus()
  })

  // do not clear session storage if previewing via the theme editor
  if (!document.querySelector('.ic-Login--previewing')) {
    sessionStorage.clear()
  }

  // Mount role selection dialog React component
  const mountPoint = document.getElementById('role-selection-dialog-mount')
  if (mountPoint) {
    import('react').then(React => {
      import('react-dom/client').then(ReactDOM => {
        import('./react/LoginPageContainer').then(module => {
          const LoginPageContainer = module.default
          const root = ReactDOM.createRoot(mountPoint)
          
          // Error boundary for graceful failure handling
          class ErrorBoundary extends React.Component<
            {children: React.ReactNode},
            {hasError: boolean}
          > {
            constructor(props: {children: React.ReactNode}) {
              super(props)
              this.state = {hasError: false}
            }

            static getDerivedStateFromError(_error: Error) {
              return {hasError: true}
            }

            componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
              console.error('Role selection dialog error:', error, errorInfo)
            }

            render() {
              if (this.state.hasError) {
                // Fail gracefully - allow login to proceed without role selection
                return null
              }
              return this.props.children
            }
          }

          root.render(
            React.createElement(ErrorBoundary, null,
              React.createElement(LoginPageContainer)
            )
          )
        }).catch((error: Error) => {
          console.error('Failed to load LoginPageContainer:', error)
        })
      }).catch((error: Error) => {
        console.error('Failed to load react-dom/client:', error)
      })
    }).catch((error: Error) => {
      console.error('Failed to load React:', error)
    })
  }
})
