import React, { useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import eyeIcon from "../../../public/images/showhide.png";
import styles from "./Register.module.css";
import GradientButton from "@/app/components/GradienButton";
import { postRequest } from "@/utils/httpUtils";

const Register: React.FC = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [isFormFilled, setIsFormFilled] = useState(false);
  const [isPasswordMatching, setIsPasswordMatching] = useState(true);
  const router = useRouter();

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const toggleConfirmPasswordVisibility = () => {
    setConfirmPasswordVisible(!confirmPasswordVisible);
  };

  const validatePassword = () => {
    return password === confirmPassword;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validatePassword()) {
      setIsPasswordMatching(false);
      return;
    }

    try {
      const data = {
        email: email,
        username: username,
        password: password,
      };

      console.log(data, "DATA")

      const response = await postRequest("register", data);

      console.log(response.message, response.ok, response.status, "RESPONSE")

      if (response.message === "User has been created successfully") {
        router.push("/login");
      } else {
        console.error("Registration failed");
      }
    } catch (error) {
      console.error("Error during registration:", error);
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setIsFormFilled(
      e.target.value.trim() !== "" &&
        password.trim() !== "" &&
        username.trim() !== "" &&
        confirmPassword.trim() !== ""
    );
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
    setIsFormFilled(
      e.target.value.trim() !== "" &&
        email.trim() !== "" &&
        password.trim() !== "" &&
        confirmPassword.trim() !== ""
    );
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setIsFormFilled(
      email.trim() !== "" &&
        username.trim() !== "" &&
        e.target.value.trim() !== "" &&
        confirmPassword.trim() !== ""
    );
    setIsPasswordMatching(confirmPassword === e.target.value);
  };

  const handleConfirmPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setConfirmPassword(e.target.value);
    setIsFormFilled(
      email.trim() !== "" &&
        password.trim() !== "" &&
        username.trim() !== "" &&
        e.target.value.trim() !== "" &&
        e.target.value.trim() === password.trim()
    );
    setIsPasswordMatching(e.target.value === password);
  };

  return (
    <>
      <div className={styles.registerContainer}>
        <div className={styles.registerForm}>
          <h2>Register</h2>
          <form onSubmit={handleRegister}>
            <div className={styles.formGroup}>
              <input
                type="text"
                placeholder="Enter Email"
                value={email}
                onChange={handleEmailChange}
              />
            </div>
            <div className={styles.formGroup}>
              <input
                type="text"
                placeholder="Enter Username"
                value={username}
                onChange={handleUsernameChange}
              />
            </div>
            <div className={styles.formGroup}>
              <input
                type={passwordVisible ? "text" : "password"}
                placeholder="Create Password"
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
            <div className={styles.formGroup}>
              <input
                type={confirmPasswordVisible ? "text" : "password"}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
              />
              <span
                className={styles.togglePassword}
                onClick={toggleConfirmPasswordVisibility}
              >
                <Image src={eyeIcon} alt="eye-icon" width={24} height={20} />
              </span>
            </div>
            {!isPasswordMatching && (
              <p className={styles.errorMessage}>
                Password and Confirm Password do not match
              </p>
            )}
            <GradientButton
              onClick={handleRegister}
              disabled={!isFormFilled || !isPasswordMatching}
              gradientColors={["#62CDCB 24.88%", "#4599DB 78.49%"]}
            >
              Register
            </GradientButton>
            <div className={styles.registerText}>
              <p style={{ marginTop: "50px" }}>
                Have an Account? <a href="/login">Login here</a>
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

export default Register;
