import React, { useEffect, useState } from "react";
import { useAuth } from "../Context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const { user, handleUserLogin } = useAuth();
  const navigate = useNavigate();

  const [creditials, setCreditials] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    if (user) navigate("/");
  }, []);

  const onChangeHandler = (e) => {
    let name = e.target.name;
    let value = e.target.value;

    setCreditials({ ...creditials, [name]: value });
  };

  return (
    <>
      <div className="auth--container">
        <div className="form--wrapper">
          <form
            onSubmit={(e) => {
              handleUserLogin(e, creditials);
              setCreditials({ email: "", password: "" });
            }}
          >
            <div className="field--wrapper">
              <label>Email:</label>
              <input
                required
                type="email"
                name="email"
                placeholder="Enter your email..."
                value={creditials.email}
                onChange={onChangeHandler}
              />
            </div>

            <div className="field--wrapper">
              <label>Password:</label>
              <input
                required
                type="password"
                name="password"
                placeholder="Enter password..."
                value={creditials.password}
                onChange={onChangeHandler}
              />
            </div>

            <div className="field--wrapper">
              <input
                type="submit"
                value="Login"
                className="btn btn--lg btn--main"
              />
            </div>
          </form>

          <p>
            Dont have an account? Register <Link to="/register">here</Link>
          </p>
        </div>
      </div>
    </>
  );
}
