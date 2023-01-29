import Cookies from "js-cookie";

export const fetchRooms = async () => {
  const response = await fetch(import.meta.env.VITE_API_URL + "/api/rooms",
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": "Bearer " + Cookies.get("token"),
      },
    }
  );
  const data = await response.json();
  return data;
}

export const fetchRoom = async (id) => {
  const response = await fetch(import.meta.env.VITE_API_URL + "/api/rooms/" + id,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": "Bearer " + Cookies.get("token"),
      },
    }
  );
  const data = await response.json();
  console.log(data);
  return data;
}
