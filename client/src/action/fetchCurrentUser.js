import axios from "axios";

export const fetchCurrentUser = (id) => async (dispatch) => {
  try {
    const { data } = await axios.get(`http://localhost:5000/user/${id}`);
    dispatch({ type: "FETCH_CURRENT_USER", payload: { result: data } });
  } catch (error) {
    console.log(error);
  }
};
