import axios from "axios";

let api;

if (process.env.NODE_ENV === "production") {
  api = axios.create({
    baseURL: "/api/v1",
  });
} else {
  api = axios.create({
    baseURL: "http://localhost:5000/api/v1",
  });
}

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
