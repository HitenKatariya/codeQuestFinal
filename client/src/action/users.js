import * as api from "../api";

// Fetch all users
export const fetchallusers = () => async (dispatch) => {
  try {
    const { data } = await api.getallusers();
    dispatch({ type: "FETCH_USERS", payload: data });
  } catch (error) {
    console.log(error);
  }
};

// Update user profile (with avatar upload support)
export const updateprofile = (id, updatedata) => async (dispatch) => {
  try {
    const { data } = await api.updateprofile(id, updatedata);
    dispatch({ type: "UPDATE_CURRENT_USER", payload: data });
    // Refresh users after update
    const users = await api.getallusers();
    dispatch({ type: "FETCH_USERS", payload: users.data });
    return data; // <-- Add this line to return the updated user object
  } catch (error) {
    console.log(error);
  }
};