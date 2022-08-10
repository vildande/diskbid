import axios from "axios";

const AUTH_API_BASE_URL = "http://localhost:8080/api/v1/auth";

class UserService {
  login(loginData) {
    const data = {
      username: loginData.username,
      password: loginData.password,
    };

    return axios.post(`${AUTH_API_BASE_URL}/signin`, data);
  }

  register(registerData) {
    const data = {
      username: registerData.username,
      email: registerData.email,
      password: registerData.password,
    };

    return axios.post(`${AUTH_API_BASE_URL}/signup`, data);
  }
}

export default new UserService();
