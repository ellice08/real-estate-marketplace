import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ReactComponent as ArrowRightIcon } from "../assets/svg/keyboardArrowRightIcon.svg";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import visibilityIcon from "../assets/svg/visibilityIcon.svg";
import { toast } from "react-toastify";
import OAuth from "../components/OAuth";

function Signin() {
  const [showPassword, setShowpassword] = useState(false);
  const [formData, setFormData] = useState({
    email: " ",
    password: " ",
  });

  const { email, password } = formData;

  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      const auth = getAuth();

      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      if (userCredential.user) {
        navigate("/");
      }
    } catch (error) {
      toast.error("Invalid Credentials");
    }
  };

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  return (
    <>
      <div className="pageContainer">
        <header>
          <p className="pageHeader">Welcome back</p>
        </header>
        <main>
          <form onSubmit={onSubmit}>
            <div className="emailInputDiv">
              <input
                type="email"
                id="email"
                placeholder="Email"
                className="emailInput"
                value={email}
                onChange={onChange}
              />
            </div>
            <div className="passwordInputDiv">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                id="password"
                className="passwordInput"
                value={password}
                onChange={onChange}
              />
              <img
                src={visibilityIcon}
                alt=" Show Password"
                className="showPassword"
                onClick={() => {
                  setShowpassword(!showPassword);
                }}
              />
            </div>
            <Link to="/forgot-password" className="forgotPasswordLink">
              Forgot Password
            </Link>
            <div className="signInBar">
              <p className="signInText">Sign In</p>
              <button className="signInButton">
                <ArrowRightIcon width="34px" height="34px" fill="#ffffff" />
              </button>
            </div>
          </form>
        </main>
        <OAuth />
        <Link to="/sign-up" className="registerLink">
          Sign Up Instead
        </Link>
      </div>
    </>
  );
}

export default Signin;
