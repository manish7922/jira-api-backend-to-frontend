import axois from "axios";

const baseURL = "http://localhost:2411";

function get(url) {
  return axois.get(baseURL + url);
}
function post(url, obj) {
  return axois.post(baseURL + url, obj);
}

function put(url, obj) {
  return axois.put(baseURL + url, obj);
}

export default {
  get,
  put,
  post,
};