import { api } from "./api";

export const login = async ({ login, password }) => {
  const res = await api
    .post("auth", {
      login,
      password,
    })
    .then((res) => {
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("loginValidTime", Date.now() + 3600000);

      api.defaults.headers.common.Authorization = res.data.token;

      return res;
    })
    .catch((err) => {
      return err.response.status;
    });

  return res;
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("loginValidTime");
  api.defaults.headers.common.Authorization = null;
};
