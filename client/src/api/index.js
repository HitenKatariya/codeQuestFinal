import axios from "axios";

const API = axios.create({
  baseURL: "https://codequestfinal.onrender.com",
});

API.interceptors.request.use((req) => {
  const profile = localStorage.getItem("Profile");
  if (profile) {
    const token = JSON.parse(profile).token;
    console.log("JWT sent:", token);
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// ========== Auth APIs ==========
export const login = (authdata) => API.post("/user/login", authdata);
export const signup = (authdata) => API.post("/user/signup", authdata);

// ========== Users ==========
export const getallusers = () => API.get("/user/getallusers");

// Avatar/Profile update (multipart/form-data)
export const updateprofile = (id, updatedata) =>
  API.patch(`/user/update/${id}`, updatedata);

// ========== Questions ==========
export const postquestion = (questiondata) =>
  API.post("/questions/Ask", questiondata);

export const getallquestions = () => API.get("/questions/get");

export const deletequestion = (id) => API.delete(`/questions/delete/${id}`);

export const votequestion = (id, value) =>
  API.patch(`/questions/vote/${id}`, { value });

// ========== Answers ==========
export const postanswer = (
  id,
  noofanswers,
  answerbody,
  useranswered,
  userid
) =>
  API.patch(`/answer/post/${id}`, {
    noofanswers,
    answerbody,
    useranswered,
    userid,
  });

export const deleteanswer = (id, answerid, noofanswers) =>
  API.patch(`/answer/delete/${id}`, {
    answerid,
    noofanswers,
  });
