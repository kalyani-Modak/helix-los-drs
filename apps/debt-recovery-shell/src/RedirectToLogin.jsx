import { useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

const RedirectToLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { orgName } = useParams();

  useEffect(() => {
    if (orgName && /^[a-zA-Z0-9]{2,}$/.test(orgName)) {
      const nextRealmCode = orgName.toUpperCase();
      const nextRealmDesc = location?.state?.realmDesc || "";

      navigate("/homelayout/login", {
        replace: true,
        state: {
          realmCode: nextRealmCode,
          realmDesc: nextRealmDesc,
        },
      });
    } else {
      console.warn("Invalid orgName:", orgName);
      navigate("/", { replace: true });
    }
  }, [location?.state?.realmDesc, navigate, orgName]);

  return null;
};

export default RedirectToLogin;