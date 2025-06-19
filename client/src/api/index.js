import axios from "axios";

const API = axios.create({
<<<<<<< HEAD
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:3000",
=======
  baseURL: "https://codequestfinal.onrender.com",
>>>>>>> 5e61c587716133c814de136ae9820d7dc499616e
});

API.interceptors.request.use((req) => {
  const profile = localStorage.getItem("Profile");
  if (profile) {
    const token = JSON.parse(profile).token;
    // Debug log
    console.log("JWT sent:", token);
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// ...rest of your API exports
<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> 5e61c587716133c814de136ae9820d7dc499616e

// Auth APIs
export const login = (authdata) => API.post("/user/login", authdata);
export const signup = (authdata) => API.post("/user/signup", authdata);

// Users APIs
export const getallusers = () => API.get("/user/getallusers");

//  Avatar/Profile update (multipart/form-data)
export const updateprofile = (id, updatedata) =>
  API.patch(`/user/update/${id}`, updatedata);

<<<<<<< HEAD
=======
<<<<<<< HEAD
// Questions APIs
export const postquestion = (questiondata) =>
  API.post("/questions/Ask", questiondata);
export const getallquestions = () => API.get("/questions/get");
export const deletequestion = (id) => API.delete(`/questions/delete/${id}`);
export const votequestion = (id, value) =>
  API.patch(`/questions/vote/${id}`, { value });
=======
>>>>>>> 1e3091e (first commit)

// Auth APIs
export const login = (authdata) => API.post("/user/login", authdata);
export const signup = (authdata) => API.post("/user/signup", authdata);

<<<<<<< HEAD
// Answers APIs
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

=======
// Users APIs
export const getallusers = () => API.get("/user/getallusers");

//  Avatar/Profile update (multipart/form-data)
export const updateprofile = (id, updatedata) =>
  API.patch(`/user/update/${id}`, updatedata);

>>>>>>> 5e61c587716133c814de136ae9820d7dc499616e
// Questions APIs
export const postquestion = (questiondata) =>
  API.post("/questions/Ask", questiondata);
export const getallquestions = () => API.get("/questions/get");
export const deletequestion = (id) => API.delete(`/questions/delete/${id}`);
export const votequestion = (id, value) =>
  API.patch(`/questions/vote/${id}`, { value });

// Answers APIs
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

<<<<<<< HEAD
=======
>>>>>>> 1e3091e (first commit)
>>>>>>> 5e61c587716133c814de136ae9820d7dc499616e
export const deleteanswer = (id, answerid, noofanswers) =>
  API.patch(`/answer/delete/${id}`, {
    answerid,
    noofanswers,
<<<<<<< HEAD
  });
=======
<<<<<<< HEAD
  });
=======
export const postanswer=(id,noofanswers,answerbody,useranswered,userid)=>API.patch(`/answer/post/${id}`,{noofanswers,answerbody,useranswered,userid});
export const deleteanswer=(id,answerid,noofanswers)=>API.patch(`/answer/delete/${id}`,{answerid,noofanswers});
>>>>>>> 72376a5 (Edirprofileform.jsx)
=======
  });
>>>>>>> 1e3091e (first commit)
>>>>>>> 5e61c587716133c814de136ae9820d7dc499616e
