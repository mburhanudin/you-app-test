// src/pages/login/index.tsx
import React, { useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import eyeIcon from "../../../public/images/showhide.png";
import styles from "./Login.module.css";
import GradientButton from "@/app/components/GradienButton";
import { postRequest } from "@/utils/httpUtils";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isFormFilled, setIsFormFilled] = useState(false);
  const router = useRouter();

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setIsFormFilled(e.target.value.trim() !== "" && password.trim() !== "");
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setIsFormFilled(email.trim() !== "" && e.target.value.trim() !== "");
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const data = {
        email: email,
        password: password,
        username: email,
      };
      const response = await postRequest("login", data);
      const token = response.access_token;
      // Save the token to local storage
      localStorage.setItem("token", token);

      // Redirect to the home page on successful login
      router.push("/");
    } catch (error) {
      console.error(error);
      // Handle login failure (display error message or take appropriate action)
    }
  };

  return (
    <>
      <div className={styles.loginContainer}>
        <div className={styles.loginForm}>
          <h2>Login</h2>
          <form onSubmit={handleLogin}>
            <div className={styles.formGroup}>
              <input
                type="text"
                placeholder="Enter Username/Email"
                value={email}
                onChange={handleEmailChange}
              />
            </div>
            <div className={styles.formGroup}>
              <input
                type={passwordVisible ? "text" : "password"}
                placeholder="Enter Password"
                value={password}
                onChange={handlePasswordChange}
              />
              <span
                className={styles.togglePassword}
                onClick={togglePasswordVisibility}
              >
                <Image src={eyeIcon} alt="eye-icon" width={24} height={20} />
              </span>
            </div>
            <GradientButton
              onClick={handleLogin}
              disabled={!isFormFilled}
              gradientColors={["#62CDCB 24.88%", "#4599DB 78.49%"]}
            >
              Login
            </GradientButton>
            <div className={styles.registerText}>
              <p style={{ marginTop: "50px" }}>
                No Account? <a href="/register">Register here</a>
              </p>
            </div>
          </form>
        </div>
        <div className={styles.mobileInfoText}>
          Buka tampilan dengan mode mobile web app untuk melihat informasi lebih
          lanjut.
        </div>
      </div>
    </>
  );
};

export default Login;
