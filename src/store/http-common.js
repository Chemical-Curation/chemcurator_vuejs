import axios from "axios";

export const HTTP = axios.create({
  baseURL: process.env.VUE_APP_API_URL,
  withCredentials: true,
  headers: { 'Content-Type': "application/vnd.api+json"}
});
