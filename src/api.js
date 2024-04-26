import axios from "axios";

const BASE_URL = "thhp://localhost:3001/todos";

export const removeTodo = async (id) => {
  try {
    const res = await axios.delete(`${BASE_URL}/${id}`);
    return res.data;
  } catch (error) {
    throw new Error();
  }
};
