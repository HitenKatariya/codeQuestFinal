import axios from "axios";

export const fetchCurrentUser = (id) => async (dispatch) => {
  try {
    const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/user/${id}`);
    dispatch({ type: "FETCH_CURRENT_USER", payload: { result: data } });
  } catch (error) {
    console.log(error);
  }
};
