import axios from "axios";

const BASEURL = process.env.REACT_APP_API_BASE_URL;

export const instanceAxios = axios.create({
  baseURL: BASEURL,
  headers: {
    "Content-Type": "application/json",
  },
});
