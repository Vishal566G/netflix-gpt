import React, { useRef, useState } from "react";
import Header from "./Header";
import { LOGIN_BACKGROUND } from "../utils/constants";
import { checkValidData } from "../utils/validate";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { auth } from "../utils/firebase";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";

const Login = () => {
  const [isSignInForm, setIsSignInForm] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const dispatch = useDispatch();

  const name = useRef(null);
  const email = useRef(null);
  const password = useRef(null);

  const handleButtonClick = () => {
    const nameValue = name.current ? name.current.value : "";
    const emailValue = email.current ? email.current.value : "";
    const passwordValue = password.current ? password.current.value : "";

    // Validate the form data
    const message = checkValidData(nameValue, emailValue, passwordValue);
    setErrorMessage(message);
    if (message) return;

    // Sign In/ Sign Up logic
    if (!isSignInForm) {
      // Sign up form
      createUserWithEmailAndPassword(auth, emailValue, passwordValue)
        .then((userCredential) => {
          // Signed up
          const user = userCredential.user;
          updateProfile(user, {
            displayName: nameValue,
            photoURL: "https://example.com/jane-q-user/profile.jpg",
          })
            .then(() => {
              // Profile updated!
              const { uid, email, displayName } = auth.currentUser;
              dispatch(
                addUser({ uid: uid, email: email, displayName: displayName })
              );
            })
            .catch((error) => {
              // An error occurred
              setErrorMessage(error);
            });
          console.log(user);
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          setErrorMessage(errorCode + "-" + errorMessage);
        });
    } else {
      // Sign In for
      signInWithEmailAndPassword(auth, emailValue, passwordValue)
        .then((userCredential) => {
          // Signed in
          const user = userCredential.user;
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          setErrorMessage(errorCode + "-" + errorMessage);
        });
    }
  };

  const toggleSignInForm = () => {
    setIsSignInForm(!isSignInForm);
  };
  return (
    <div className="">
      <Header />
      <div className="absolute">
        <img src={LOGIN_BACKGROUND} alt="background_image" />
      </div>
      <div className="absolute bg-black w-3/12 mt-36 left-0 right-0 mx-auto text-white bg-opacity-80">
        <form onSubmit={(e) => e.preventDefault()} className="flex flex-col">
          <h1 className="text-3xl font-bold my-8 mx-6">
            {isSignInForm ? "Sign In" : "Sign Up"}
          </h1>
          {!isSignInForm && (
            <input
              ref={name}
              type="text"
              placeholder="Full Name"
              className="my-2 mx-5 py-3 px-2 rounded bg-[#11100f] text-[#8daeb8]"
            />
          )}
          <input
            ref={email}
            type="email"
            placeholder="Email Address"
            className="my-2 mx-5 py-3 px-2 rounded bg-[#11100f] text-[#8daeb8]"
          />
          <input
            ref={password}
            type="password"
            placeholder="Password"
            className="my-2 mx-5 py-3 px-2 rounded bg-[#11100f] text-[#8daeb8]"
          />
          <div className="mx-5 pt-3 px-2 font-bold h-11">
            <p className="text-red-600 text-lg">{errorMessage}</p>
          </div>

          <button
            className="bg-[#e50914] my-10 mx-5 py-3 px-2 rounded"
            onClick={handleButtonClick}
          >
            {isSignInForm ? "Sign In" : "Sign Up"}
          </button>
          <p
            className="my-2 mx-5 py-3 px-2 cursor-pointer"
            onClick={toggleSignInForm}
          >
            {isSignInForm
              ? "New to Netflix? Sign up now."
              : "Already a user? Sign in here"}
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
