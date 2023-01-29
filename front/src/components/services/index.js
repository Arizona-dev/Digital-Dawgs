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
  return data;
}

export const getMessages = async (roomId) => {
  const response = await fetch(import.meta.env.VITE_API_URL + "/api/rooms/" + roomId + "/messages",
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

export const createRoom = async (title, description, maxParticipants, isPrivate = false) => {
  const response = await fetch(import.meta.env.VITE_API_URL + "/api/rooms",
    {
      "method": "POST",
      "headers": {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": "Bearer " + Cookies.get("token"),
      },
      "body": JSON.stringify({
        title,
        description,
        maxParticipants,
        isPrivate,
      }),
    }
  );
  const data = await response.json();
  return data;
}

export const deleteRoom = async (id) => {
  const response = await fetch(import.meta.env.VITE_API_URL + "/api/rooms/" + id,
    {
      "method": "DELETE",
      "headers": {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": "Bearer " + Cookies.get("token"),
      },
    }
  );
  const data = await response.json();
  return data;
}

export const updateRoom = async (room) => {
  const response = await fetch(import.meta.env.VITE_API_URL + "/api/rooms/" + room.id,
    {
      "method": "PUT",
      "headers": {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": "Bearer " + Cookies.get("token"),
      },
      "body": JSON.stringify({
        ...room
      }),
    }
  );
  const data = await response.json();
  return data;
}
