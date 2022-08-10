import { useEffect, useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import UserService from "../service/UserService";

const LoginPage = () => {
  const { user, signin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
  });

  const [loginErrors, setLoginErrors] = useState({});

  const [isSubmitted, setIsSubmitted] = useState(false);

  const [formError, setFormError] = useState(null);

  useEffect(() => {
    if (isSubmitted) {
      UserService.login(loginData)
        .then((response) => {
          const user = response?.data;
          signin(user, () => navigate(fromPage, { replace: true }));
        })
        .catch((error) => {
          setFormError("Incorrect username or password!");
          setIsSubmitted(false);
        });
    }
  }, [loginErrors]);

  const fromPage = location.state?.from?.pathname || "/";

  const handleChange = (event) => {
    const { name, value } = event.target;
    setLoginData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setLoginErrors(validate(loginData));
  };

  const validate = (values) => {
    const errors = {};
    const usernameRegex = new RegExp("^[a-z0-9]{3,16}$");
    const passwordRegex = new RegExp(
      `^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,20}$`
    );

    if (!String(values.username).match(usernameRegex)) {
      errors.username =
        "Username should be 3-16 characters, and shouldn't include any special character or capital letters!";
    }
    if (!String(values.password).match(passwordRegex)) {
      errors.password =
        "Password should be 8-20 characters and include at least 1 letter, 1 number and 1 special character!";
    }

    if (Object.keys(errors).length === 0) {
      setIsSubmitted(true);
    }

    return errors;
  };

  return (
    <div className="my-3 flex max-w-2xl mx-auto shadow border-b">
      <div className="px-8 py-8">
        <div className="font-thin text-2xl tracking wider">Login</div>
        <p className="text-red-600">{formError}</p>
        <form onSubmit={handleSubmit}>
          <div className="items-center justify-center w-96 my-4">
            <label
              className="block text-gray-600 text-sm font-normal"
              htmlFor="username"
            >
              Username
            </label>
            <input
              type="text"
              name="username"
              id="username"
              value={loginData.username}
              onChange={(e) => handleChange(e)}
              className="w-96 border mt-2 px-2 py-2"
            />
            <p className="text-red-600">{loginErrors.username}</p>
          </div>

          <div className="items-center justify-center w-96 my-4">
            <label
              className="block text-gray-600 text-sm font-normal"
              htmlFor="password"
            >
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              value={loginData.password}
              onChange={(e) => handleChange(e)}
              className="h-10 w-96 border mt-2 px-2 py-2"
            />
            <p className="text-red-600">{loginErrors.password}</p>
          </div>

          <div className="items-center justify-center h-14 w-full space-x-5 my-4 pt-4">
            <button className="rounded text-white font-semibold bg-slate-600 hover:bg-slate-700  py-2 px-6">
              Login
            </button>
            <Link className="text-blue-700 text-sm font-normal" to="/register">
              No account?
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export { LoginPage };
