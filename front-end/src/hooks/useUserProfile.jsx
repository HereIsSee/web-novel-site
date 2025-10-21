import { useEffect, useState } from "react";
import { useAuth } from "../context/useAuth";
import { httpRequest } from "../api/http";

const useUserProfile = () => {
  const { token } = useAuth();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    if (token) {
      httpRequest("/api/auth/me")
        .then((data) => setProfile(data))
        .catch((err) => console.error(err));
    }
  }, [token]);

  return profile;
};

export default useUserProfile;
