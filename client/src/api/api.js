import axios from "axios";

const api = axios.create({
  baseURL: "/api/v1",
});

export async function getCard(id) {
  try {
    const response = await api.get(`/traits/${id}`);
    return response.data.data;
  } catch (err) {}
}
