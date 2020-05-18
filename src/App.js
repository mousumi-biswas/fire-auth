import React, { useState } from "react";
import "./App.css";
import * as firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from "./firebase.config";

firebase.initializeApp(firebaseConfig);

function App() {
  const [user, setUser] = useState({
    isSignedIn: false,
    name: "",
    email: "",
    photoURL: ""
  });

  const provider = new firebase.auth.GoogleAuthProvider();

  const handleSignIn = () => {
    firebase
      .auth()
      .signInWithPopup(provider)
      .then(res => {
        const { displayName, photoURL, email } = res.user;
        const signedInUser = {
          isSignedIn: true,
          name: displayName,
          email: email,
          photoURL: photoURL
        };
        setUser(signedInUser);
      });
  };

  const handleSignOut = () => {
    firebase
      .auth()
      .signOut()
      .then(res => {
        const signedOutUser = {
          isSignedIn: false,
          name: "",
          email: "",
          photoURL: "",
          password: "",
          error: "",
          existingUser: false,
          isValid: false
        };
        setUser(signedOutUser);
      });
  };
  const is_valid_email = email => /(.+)@(.+){2,}/.test(email);
  const hasNumber = input => /\d/.test(input);
  const switchForm = e => {
    const createdUser = { ...user };
    createdUser.existingUser = e.target.checked;
    setUser(createdUser);
  };

  const handleChange = e => {
    const newUserInfo = {
      ...user
    };
    let isValid = true;
    if (e.target.name === "email") {
      isValid = is_valid_email(e.target.value);
    }
    if (e.target.name === "password") {
      isValid = e.target.value.length > 8 && hasNumber(e.target.value);
    }

    newUserInfo[e.target.name] = e.target.value;
    newUserInfo.isValid = isValid;
    setUser(newUserInfo);
  };

  const createAccount = e => {
    if (user.isValid) {
      firebase
        .auth()
        .createUserWithEmailAndPassword(user.email, user.password)
        .then(res => {
          //console.log(res);

          const createdUser = { ...user };
          createdUser.isSignedIn = true;
          createdUser.error = "";
          setUser(createdUser);
        })
        .catch(err => {
          console.log(err.message);
          const createdUser = { ...user };
          createdUser.isSignedIn = false;
          createdUser.error = err.message;
          setUser(createdUser);
        });
    }
    e.preventDefault();
    e.target.reset();
  };

  const signInUser = e => {
    if (user.isValid) {
      firebase
        .auth()
        .signInWithEmailAndPassword(user.email, user.password)
        .then(res => {
          console.log(res);

          const createdUser = { ...user };
          createdUser.isSignedIn = true;
          createdUser.error = "";
          setUser(createdUser);
        })
        .catch(err => {
          console.log(err.message);
          const createdUser = { ...user };
          createdUser.isSignedIn = false;
          createdUser.error = err.message;
          setUser(createdUser);
        });
    }
    e.preventDefault();
    e.target.reset();
  };

  return (
    <div className="App">
      {user.isSignedIn ? (
        <button onClick={handleSignOut}>
          <b>Sign out</b>
        </button>
      ) : (
        <button onClick={handleSignIn}>
          <b>Sign in</b>
        </button>
      )}
      {user.isSignedIn && (
        <div>
          <p>Welcome, {user.name}</p>
          <p>Your email: {user.email}</p>
          <img src={user.photoURL} alt=""></img>
        </div>
      )}

      <h1>Our own Authentication</h1>
      <input
        type="checkbox"
        name="switchForm"
        onChange={switchForm}
        id="switchForm"
      />
      <label htmlFor="switchForm">Returning User</label>

      <form
        style={{ display: user.existingUser ? "block" : "none" }}
        onSubmit={signInUser}
      >
        <input
          type="text"
          onChange={handleChange}
          name="email"
          placeholder="your email"
          required
        />
        <br />
        <input
          type="password"
          name="password"
          placeholder="your password"
          required
        />
        <br />
        <input type="submit" value="SignIn" />
      </form>

      <form
        style={{ display: user.existingUser ? "none" : "block" }}
        onSubmit={createAccount}
      >
        <input
          type="text"
          onChange={handleChange}
          name="name"
          placeholder="your name"
          required
        />
        <br />
        <input
          type="text"
          onChange={handleChange}
          name="email"
          placeholder="your email"
          required
        />
        <br />
        <input
          type="password"
          name="password"
          placeholder="your password"
          required
        />
        <br />
        <input type="submit" value="Create Account" />
      </form>
      {user.error && <p style={{ color: "red" }}>{user.error}</p>}
    </div>
  );
}

export default App;
