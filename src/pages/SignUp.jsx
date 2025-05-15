import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  getAuth,
  updateProfile,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { setDoc, doc, serverTimestamp } from "@firebase/firestore";
import { db } from "../firebase.config";
import { ReactComponent as ArrowRightIcon } from "../assets/svg/keyboardArrowRightIcon.svg";
import visibilityIcon from "../assets/svg/visibilityIcon.svg";
import { toast } from "react-toastify";
import OAuth from "../components/OAuth";

function SignUp() {
  const [showPassword, setShowpassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const { name, email, password } = formData;

  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      const auth = getAuth();

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential.user;

      await updateProfile(auth.currentUser, { displayName: name });

      const formDataCopy = { ...formData };
      delete formDataCopy.password;
      formDataCopy.timestamp = serverTimestamp();

      await setDoc(doc(db, "users", user.uid), formDataCopy);

      navigate("/");
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
          <p className="pageHeader">Sign Up</p>
        </header>
        <main>
          <form onSubmit={onSubmit}>
            <input
              type="text"
              id="name"
              placeholder="Name"
              className="nameInput"
              value={name}
              onChange={onChange}
            />

            <input
              type="email"
              id="email"
              placeholder="Email"
              className="emailInput"
              value={email}
              onChange={onChange}
            />

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

            <Link to="/forgot-password" className="forgotPasswordLink">
              Forgot Password
            </Link>
            <div className="signInBar">
              <p className="signInText">Sign Up</p>
              <button className="signInButton">
                <ArrowRightIcon width="34px" height="34px" fill="#ffffff" />
              </button>
            </div>
          </form>
        </main>
        <OAuth />

        <Link to="/sign-in" className="registerLink">
          Sign In Instead
        </Link>
      </div>
    </>
  );
}

export default SignUp;
