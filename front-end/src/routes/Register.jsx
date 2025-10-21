import { useState } from "react";
import { Link } from "react-router-dom";
import InputField from "../components/FormFields/InputField";
import Button from "../components/FormFields/Button";
import { useToast } from "../context/useToast";
import { registerUser } from "../api/users";

const Register = () => {
  const { showToast } = useToast();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordAgain, setPasswordAgain] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();

    if (password != passwordAgain) {
      showToast("Password does not match Password again!", "error");
      return;
    }
    try {
      const response = await registerUser({
        UserName: username,
        Email: email,
        Password: password,
      });

      console.log("User registered:", response);

      setUsername("");
      setEmail("");
      setPassword("");
      setPasswordAgain("");

      showToast("Registration successful!", "success");
    } catch (err) {
      console.error("Registration failed:", err);
      showToast(err.message || "Registration failed", "error");
    }
  };

  return (
    <div className="auth-cover cover-background">
      <div className="auth-container">
        <Link className="title" to="/">
          FableBound
        </Link>
        <h2>Registration</h2>
        <form onSubmit={(e) => onSubmit(e)}>
          <div className="form-item">
            <label htmlFor="register-username">Username:</label>
            <InputField
              id="register-username"
              type="text"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required={true}
            />
          </div>

          <div className="form-item">
            <label htmlFor="register-email">Email address:</label>
            <InputField
              id="register-email"
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required={true}
            />
          </div>

          <div className="form-item">
            <label htmlFor="register-password">Password:</label>
            <InputField
              id="register-password"
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required={true}
            />
          </div>

          <div className="form-item">
            <label htmlFor="register-password-again">Password again:</label>
            <InputField
              id="register-password-again"
              type="password"
              name="password-again"
              value={passwordAgain}
              onChange={(e) => setPasswordAgain(e.target.value)}
              required={true}
            />
          </div>

          <Button styleType="blue-white-rounded" type="submit">
            Register
          </Button>
        </form>

        <Link to="/login">Already have an account? Login</Link>
      </div>
    </div>
  );
};

export default Register;
