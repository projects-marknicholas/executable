import React, {useEffect} from "react";

// Router
import { Link } from "react-router-dom";

// Assets
import Logo from "../assets/svg/favicon.png";

const ForgotPassword = () => {
  
  // Page title
  useEffect(() => {
    document.title = "Forgot Password - RHU";
  });
  
  return(
    <>
    <div className="auth">
      <form className="log-form">
        <div className="header">
          <Link to="/" className="auth">
            <img src={Logo} alt="Logo" />
          </Link>
          <h1>Forgotten your password?</h1>
          <p><Link to="/">back to login</Link></p>

          <div className="form-group">
            <label htmlFor="email">
              <div className="flex-label">
                <p>Email address <span>*</span><br/></p>
              </div>
              <input 
                type="email"
                id="email"
                name="email"
                autoComplete="off"
                autoFocus
              />
            </label><br/>
          </div>

          <div className="sign forgot">
            <button 
              className="sign-m"
              type="button"
            >
              Send email
            </button>
          </div>
        </div>
      </form>
    </div>
    </>
  );
}

export default ForgotPassword;