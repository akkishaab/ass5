import {Link, withRouter} from 'react-router-dom'
import {ImHome} from 'react-icons/im'
import {FiLogout} from 'react-icons/fi'
import Cookies from 'js-cookie'
import './index.css'

const websiteLogo = 'https://assets.ccbp.in/frontend/react-js/logo-img.png'

const Header = props => {
  const {history, location} = props

  const onClickLogout = () => {
    Cookies.remove('jwt_token')
    history.replace('/login')
  }

  const isAuthenticated = Cookies.get('jwt_token')

  return (
    <nav className="nav-container">
      <ul className="header-ul-container">
        <li className="logo-container">
          <Link className="link" to="/">
            <img
              className="logo"
              src={websiteLogo}
              alt="website logo"
              data-testid="website-logo"
            />
          </Link>
        </li>
        <li className="home-jobs-container">
          <Link className="link" to="/">
            <ImHome className="home-icon" />
            <h1 className="nav-text">Home</h1>
          </Link>
          {isAuthenticated && (
            <Link className="link" to="/jobs">
              <h1 className="nav-text">Jobs</h1>
            </Link>
          )}
        </li>
        {isAuthenticated && (
          <li>
            <button
              type="button"
              className="btn-logout"
              onClick={onClickLogout}
              data-testid="logout-button"
            >
              <FiLogout className="home-icon" />
              Logout
            </button>
          </li>
        )}
      </ul>
    </nav>
  )
}

export default withRouter(Header)
