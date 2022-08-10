import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserService from "../service/UserService";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [registerData, setRegisterData] = useState({
    username: "",
    email: "",
    password: "",
    repeatPassword: "",
  });

  const [registerErrors, setRegisterErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formError, setFormError] = useState(null);

  useEffect(() => {
    if (isSubmitted) {
      UserService.register(registerData)
        .then((response) => {
          navigate("/login");
        })
        .catch((error) => {
          setFormError(error.response.data.message);
          setIsSubmitted(false);
        });
    }
  }, [registerErrors]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setRegisterData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setRegisterErrors(validate(registerData));
  };

  const validate = (values) => {
    const errors = {};

    const usernameRegex = new RegExp("^[a-z0-9]{3,16}$");
    const emailRegex = new RegExp("[a-z0-9]+@[a-z]+.[a-z]{2,3}");
    const passwordRegex = new RegExp(
      `^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,20}$`
    );

    if (!String(values.username).match(usernameRegex)) {
      errors.username =
        "Username should be 3-16 characters, and shouldn't include any special character or capital letters!";
    }
    if (!String(values.email).match(emailRegex)) {
      errors.email =
        "Password should be 8-20 characters and include at least 1 letter, 1 number and 1 special character!";
    }
    if (!String(values.password).match(passwordRegex)) {
      errors.password =
        "Password should be 8-20 characters and include at least 1 letter, 1 number and 1 special character!";
    }
    if (values.repeatPassword !== values.password) {
      errors.repeatPassword = "Repeated password should match the password";
    }

    if (Object.keys(errors).length === 0) {
      setIsSubmitted(true);
    }

    return errors;
  };

  return (
    <div className="my-3 flex max-w-2xl mx-auto shadow border-b">
      <div className="px-8 py-8">
        <div className="font-thin text-2xl tracking wider">Register</div>
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
              value={registerData.username}
              onChange={(e) => handleChange(e)}
              className="w-96 border mt-2 px-2 py-2"
            />
            <p className="text-red-600">{registerErrors.username}</p>
          </div>
          <div className="items-center justify-center w-96 my-4">
            <label
              className="block text-gray-600 text-sm font-normal"
              htmlFor="email"
            >
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              value={registerData.email}
              onChange={(e) => handleChange(e)}
              className="w-96 border mt-2 px-2 py-2"
            />
            <p className="text-red-600">{registerErrors.email}</p>
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
              value={registerData.password}
              onChange={(e) => handleChange(e)}
              className="w-96 border mt-2 px-2 py-2"
            />
            <p className="text-red-600">{registerErrors.password}</p>
          </div>

          <div className="items-center justify-center w-96 my-4">
            <label
              className="block text-gray-600 text-sm font-normal"
              htmlFor="repeatPassword"
            >
              Repeat Password
            </label>
            <input
              type="password"
              name="repeatPassword"
              id="repeatPassword"
              value={registerData.repeatPassword}
              onChange={(e) => handleChange(e)}
              className="w-96 border mt-2 px-2 py-2"
            />
            <p className="text-red-600">{registerErrors.repeatPassword}</p>
          </div>

          <div className="items-center justify-center w-96 my-4 space-x-4 pt-4">
            <button className="rounded text-white font-semibold bg-slate-600 hover:bg-slate-700  py-2 px-6">
              Register
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export { RegisterPage };
