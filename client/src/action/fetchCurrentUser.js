import axios from "axios";

export const fetchCurrentUser = (id) => async (dispatch) => {
  try {
<<<<<<< HEAD
    const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/user/${id}`);
=======
    const { data } = await axios.get(`http://localhost:5000/user/${id}`);
>>>>>>> 5e61c587716133c814de136ae9820d7dc499616e
    dispatch({ type: "FETCH_CURRENT_USER", payload: { result: data } });
  } catch (error) {
    console.log(error);
  }
};
