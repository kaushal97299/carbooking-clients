/* eslint-disable @typescript-eslint/no-explicit-any */
import { jwtDecode } from "jwt-decode";

export const isTokenExpired = (token: string) => {
  try {

    const decoded: any = jwtDecode(token);

    if (!decoded.exp) return true;

    const currentTime = Date.now() / 1000;

    return decoded.exp < currentTime;

  } catch {

    return true;

  }
};

export const logoutUser = () => {

  localStorage.removeItem("token");
  localStorage.removeItem("userEmail");

  window.location.href = "/";

};