import { useLocation, useNavigate } from "react-router-dom";
import { signInWithPopup, GoogleAuthProvider, getAuth } from "firebase/auth";
import { toast } from "react-toastify";
import { getDoc, setDoc, doc, serverTimestamp } from "firebase/firestore";
import googleIcon from "../assets/svg/googleIcon.svg";
import { db } from "../firebase.config";

function OAuth() {
  const location = useLocation();
  const navigate = useNavigate();

  const onGoogleClick = async () => {
    try {
      const auth = getAuth();
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        await setDoc(doc(db, "users", user.uid), {
          name: user.displayName,
          email: user.email,
          timestamp: serverTimestamp(),
        });
        navigate("/");
      }
    } catch (error) {
      toast.error("Could not aurthorize with Google");
      toast.error(error);
      console.log(error);
    }
  };

  return (
    <div className="socialLogin">
      <p>Sign {location.pathname === "/sign-up" ? "up" : "in"} with </p>
      <button className="socialIconDiv" onClick={onGoogleClick}>
        <img className="socialIconImg" src={googleIcon} alt="Google" />
      </button>
    </div>
  );
}

export default OAuth;
