// src/pages/index.tsx
import React, { useEffect, useState } from "react";
import styles from "./Home.module.css";
import Image from "next/image";
import editIcon from "../../../public/images/edit-icon.png";
import { useRouter } from "next/router";
import { getRequest, putRequest } from "@/utils/httpUtils";

const Home: React.FC = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAdditionalInfo, setShowAdditionalInfo] = useState(false);
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    gender: "",
    birthday: "",
    horoscope: "",
    zodiac: "",
    height: "",
    weight: "",
    age: 0
  });

  const fetchProfileData = async (token: string | null) => {
    try {
      const data = await getRequest("getProfile", token);

      console.log(data, "DATA")
  
      setEmail(data.data.email);
  
      setFormData({
        name: data.data.name,
        gender: data.data.gender,
        birthday: data.data.birthday,
        horoscope: data.data.horoscope,
        zodiac: data.data.zodiac,
        height: String(data.data.height),
        weight: String(data.data.weight),
        age: calculateAge(data.data.birthday),
      });
    } catch (error) {
      setError("Error fetching profile data");
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    const token = localStorage.getItem("token");
  
    if (!token) {
      setError("Access token not found");
      setLoading(false);
      router.push("/login");
      return;
    }
  
    fetchProfileData(token);
  }, [showAdditionalInfo]);
  

  const handleEditClick = () => {
    setShowAdditionalInfo(!showAdditionalInfo);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handleSaveClick = async () => {
    // convert height and weight
    const updatedFormData = {
      ...formData,
      height: Number(formData.height),
      weight: Number(formData.weight),
    };

    const token = localStorage.getItem("token");

    if (!token) {
      setError("Access token not found");
      return;
    }

    try {
      const response = await putRequest(
        "updateProfile",
        updatedFormData,
        token
      );

      if (response.message === "Profile has been updated successfully") {
        setShowAdditionalInfo(!showAdditionalInfo);
      } else {
        setError("Error updating profile");
      }
    } catch (error) {
      setError("Error updating profile");
    }
  };

  const handleLogout = () => {
    // delete token from localStorage
    localStorage.removeItem("token");

    // Redirect to login page
    router.push("/login");
  };

  const calculateAge = (birthdate: string): number => {
    const [day, month, year] = birthdate.split("-").map(Number);

    const birthDate = new Date(year, month - 1, day);
    const currentDate = new Date();

    let age = currentDate.getFullYear() - birthDate.getFullYear();

    const hasBirthdayPassed =
      currentDate.getMonth() > birthDate.getMonth() ||
      (currentDate.getMonth() === birthDate.getMonth() &&
        currentDate.getDate() >= birthDate.getDate());

    if (!hasBirthdayPassed) {
      age--;
    }

    return age;
  };

  return (
    <div className={styles.container}>
      <div className={styles.emailText}>{email}</div>
      {loading && <p>Loading...</p>}
      {!loading && (
        <>
          <div className={styles.infoText}>
            <p>{email}</p>
            {/* <div onClick={handleLogout}>
              Logout
            </div> */}
          </div>
          <div className={styles.aboutBox}>
            <div className={styles.aboutEdit}>
              <div className={styles.aboutText}>About</div>
              <div
                className={styles.editText}
                onClick={showAdditionalInfo ? handleSaveClick : handleEditClick}
              >
                {showAdditionalInfo ? (
                  "Save & Update"
                ) : (
                  <Image
                    src={editIcon}
                    alt="Edit Icon"
                    width={20}
                    height={20}
                  />
                )}
              </div>
            </div>
            {!showAdditionalInfo && formData.name === "" && (
              <div className={styles.additionalText}>
                Add in your your to help others know you <br /> better
              </div>
            )}
            {!showAdditionalInfo && formData.name !== "" && (
              <>
                <div className="flex-col">
                  <div className={styles.flexClass}>
                    <div className={styles.aboutDataText}>Birthday: </div>
                    <div className={styles.dataProfile}>
                      {formData.birthday} {` (${formData.age})`}
                    </div>
                  </div>
                  <div className={styles.flexClass}>
                    <div className={styles.aboutDataText}>Horoscope: </div>
                    <div className={styles.dataProfile}>
                      {formData.horoscope}
                    </div>
                  </div>
                  <div className={styles.flexClass}>
                    <div className={styles.aboutDataText}>Zodiac: </div>
                    <div className={styles.dataProfile}>
                      {formData.zodiac}
                    </div>
                  </div>
                  <div className={styles.flexClass}>
                    <div className={styles.aboutDataText}>Height: </div>
                    <div className={styles.dataProfile}>
                      {formData.height}
                    </div>
                  </div>
                  <div className={styles.flexClass}>
                    <div className={styles.aboutDataText}>Weight: </div>
                    <div className={styles.dataProfile}>
                      {formData.weight}
                    </div>
                  </div>
                </div>
              </>
            )}
            {showAdditionalInfo && (
              <>
                <div className={styles.imageUploadBox}>
                  <div className={styles.imageUploadContainer}>
                    <div className={styles.imageUploadBoxContent}>
                      <div className={styles.imageUploadBackground}>+</div>
                      <div className={styles.imageUploadText}>Add Image</div>
                    </div>
                  </div>
                </div>

                <div className={styles.formGroupAbout}>
                  <label>Display Name</label>
                  <input
                    type="text"
                    placeholder="Display Name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                  />
                </div>
                <div className={styles.formGroupAbout}>
                  <label>Gender</label>
                  <select
                    value={formData.gender}
                    onChange={(e) =>
                      handleInputChange("gender", e.target.value)
                    }
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
                <div className={styles.formGroupAbout}>
                  <label>Birthday</label>
                  <input
                    type="text"
                    placeholder="DD MM YYY"
                    value={formData.birthday}
                    onChange={(e) =>
                      handleInputChange("birthday", e.target.value)
                    }
                  />
                </div>
                <div className={styles.formGroupAbout}>
                  <label>Horoscope</label>
                  <input
                    type="text"
                    placeholder="--"
                    value={formData.horoscope}
                    onChange={(e) =>
                      handleInputChange("horoscope", e.target.value)
                    }
                  />
                </div>
                <div className={styles.formGroupAbout}>
                  <label>Zodiac</label>
                  <input
                    type="text"
                    placeholder="--"
                    value={formData.zodiac}
                    onChange={(e) =>
                      handleInputChange("zodiac", e.target.value)
                    }
                  />
                </div>
                <div className={styles.formGroupAbout}>
                  <label>Height</label>
                  <input
                    type="text"
                    placeholder="Add height"
                    value={formData.height}
                    onChange={(e) =>
                      handleInputChange("height", e.target.value)
                    }
                  />
                </div>
                <div className={styles.formGroupAbout}>
                  <label>Weight</label>
                  <input
                    type="text"
                    placeholder="Add weight"
                    value={formData.weight}
                    onChange={(e) =>
                      handleInputChange("weight", e.target.value)
                    }
                  />
                </div>
              </>
            )}
          </div>
          <p className={styles.profileBox}>
            Buka tampilan dengan mode mobile web app untuk melihat informasi
            lebih lanjut.
          </p>
        </>
      )}
    </div>
  );
};

export default Home;
