import axios from "axios";

const api = axios.create({
  baseURL: "/api/v1",
});

export async function getTraitCard(id) {
  try {
    const response = await api.get(`/traits/${id}`);
    return response.data.data;
  } catch (err) {}
}

export async function getCountryCard(id) {
  try {
    const response = await api.get(`/countries/${id}`);
    return response.data.data;
  } catch (err) {}
}
