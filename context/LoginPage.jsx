import React, {useState, useEffect, useRef, useCallback} from 'react'
import {useNavigate} from 'react-router-dom'
import './LoginPage.css'

const ROLES = [
  {value: 'student', label: 'Student'},
  {value: 'faculty', label: 'Faculty'},
  {value: 'staff', label: 'Staff'},
  {value: 'admin', label: 'Admin'},
  {value: 'guardian', label: 'Guardian/Parent'},
  {value: 'hod', label: 'HOD'},
]

const ABOUT_LINKS = [
  'About Option 1',
  'About Option 2',
  'About Option 3',
  'About Option 4',
  'About Option 5',
  'About Option 6',
]

const LoginPage = () => {
  const navigate = useNavigate()

  /* ---- state ---- */

  const [selectedRole, setSelectedRole] = useState('')
  const [roleLabel, setRoleLabel] = useState('Select Role')
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [aboutOpen, setAboutOpen] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [captcha, setCaptcha] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [shake, setShake] = useState(false)

  /* ---- refs ---- */
  const cursorRef = useRef(null)
  const selectRef = useRef(null)
  const aboutRef = useRef(null)
  const closeTimeoutRef = useRef(null)

  /* ---- Remember-me: load saved username ---- */
  useEffect(() => {
    const saved = localStorage.getItem('rememberedUsername')
    if (saved) {
      setUsername(saved)
      setRememberMe(true)
    }
  }, [])

  /* ---- Custom cursor ---- */
  useEffect(() => {
    const handleMove = e => {
      if (cursorRef.current) {
        cursorRef.current.style.left = `${e.clientX}px`
        cursorRef.current.style.top = `${e.clientY}px`
      }
    }
    const handleLeave = () => {
      if (cursorRef.current) cursorRef.current.style.opacity = '0'
    }
    const handleEnter = () => {
      if (cursorRef.current) cursorRef.current.style.opacity = '1'
    }

    document.addEventListener('mousemove', handleMove)
    document.addEventListener('mouseleave', handleLeave)
    document.addEventListener('mouseenter', handleEnter)

    return () => {
      document.removeEventListener('mousemove', handleMove)
      document.removeEventListener('mouseleave', handleLeave)
      document.removeEventListener('mouseenter', handleEnter)
    }
  }, [])

  /* ---- Click-outside to close role dropdown ---- */
  useEffect(() => {
    const handler = e => {
      if (selectRef.current && !selectRef.current.contains(e.target)) {
        setDropdownOpen(false)
      }
      if (aboutRef.current && !aboutRef.current.contains(e.target)) {
        setAboutOpen(false)
      }
    }
    document.addEventListener('click', handler)
    return () => document.removeEventListener('click', handler)
  }, [])

  /* ---- Login handler ---- */
  const handleLogin = useCallback(() => {
    setErrorMsg('')
    if (!selectedRole) {
      setErrorMsg('Please select a role.')
      setShake(true)
      setTimeout(() => setShake(false), 400)
      return
    }

    // Persist remember-me preference
    if (rememberMe && username) {
      localStorage.setItem('rememberedUsername', username)
    } else {
      localStorage.removeItem('rememberedUsername')
    }

    // Navigate based on role
    if (selectedRole === 'student') {
      navigate('/dashboard')
    } else if (selectedRole === 'faculty') {
      navigate('/faculty/dashboard')
    } else if (selectedRole === 'guardian') {
      navigate('/parent/dashboard')
    } else {
      // For other roles, extend later
      alert(`Logging in as ${selectedRole}...`)
    }
  }, [selectedRole, username, password, captcha, rememberMe, navigate])

  /* ---- Forgot password ---- */
  const handleForgotPassword = e => {
    e.preventDefault()
    alert('Password reset functionality will be implemented here.')
  }

  /* ---- About hover handlers ---- */
  const handleAboutEnter = () => {
    clearTimeout(closeTimeoutRef.current)
    setAboutOpen(true)
  }
  const handleAboutLeave = () => {
    closeTimeoutRef.current = setTimeout(() => setAboutOpen(false), 200)
  }

  return (
    <div className="login-page">
      {/* Custom cursor */}
      <div className="lp-cursor-wrapper">
        <div className="lp-custom-cursor" ref={cursorRef} />
      </div>

      {/* Background */}
      <div className="lp-background">
        <img src="/lnmiit.jpg" alt="Campus Background" />
      </div>

      {/* Header */}
      <header className="lp-header">
        <div className="lp-header-title">The LNM Institute of Information Technology</div>

        <div
          ref={aboutRef}
          className={`lp-about-container${aboutOpen ? ' active' : ''}`}
          onMouseEnter={handleAboutEnter}
          onMouseLeave={handleAboutLeave}
        >
          <button
            className="lp-about-btn"
            onClick={e => {
              e.stopPropagation()
              setAboutOpen(v => !v)
            }}
          >
            About
          </button>
          <div className="lp-about-dropdown">
            {ABOUT_LINKS.map((link, i) => (
              <a key={i} href="#">
                {link}
              </a>
            ))}
          </div>
        </div>
      </header>

      {/* Login form */}
      <div className="lp-login-wrapper">
        <div className={`lp-login-box${shake ? ' shake' : ''}`}>
          <img
            src="/LNMIIT-Logo-Transperant-Background.png"
            alt="LNMIIT Logo"
            className="lp-logo"
          />

          {/* Role selector */}
          <div className="lp-custom-select" ref={selectRef}>
            <div
              className={`lp-select-selected${dropdownOpen ? ' active' : ''}`}
              onClick={() => setDropdownOpen(v => !v)}
            >
              {roleLabel}
            </div>
            <div className={`lp-select-items${dropdownOpen ? ' active' : ''}`}>
              {ROLES.map(role => (
                <div
                  key={role.value}
                  className="lp-select-item"
                  onClick={() => {
                    setSelectedRole(role.value)
                    setRoleLabel(role.label)
                    setDropdownOpen(false)
                  }}
                >
                  {role.label}
                </div>
              ))}
            </div>
          </div>

          {/* Credentials */}
          <input
            type="text"
            className="lp-input"
            placeholder="Username"
            id="login-username"
            value={username}
            onChange={e => setUsername(e.target.value)}
          />
          <input
            type="password"
            className="lp-input"
            placeholder="Password"
            id="login-password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          <input
            type="text"
            className="lp-input"
            placeholder="CAPTCHA"
            id="login-captcha"
            value={captcha}
            onChange={e => setCaptcha(e.target.value)}
          />

          {/* Options row */}
          <div className="lp-login-options">
            <label className="lp-remember">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={e => setRememberMe(e.target.checked)}
              />
              Remember me
            </label>
            <button className="lp-forgot" onClick={handleForgotPassword}>
              Forgot Password?
            </button>
          </div>

          {/* Error */}
          <div className="lp-error-msg">{errorMsg}</div>

          {/* Submit */}
          <button className="lp-submit-btn" onClick={handleLogin} id="login-submit">
            Login
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="lp-footer">© 2026 LNMIIT. All rights reserved.</div>
    </div>
  )
}

export default LoginPage
