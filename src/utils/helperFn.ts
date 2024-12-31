import axios from "axios";

export const fetchCurrentUserFn = async (_token: string) => {
  try {
    const res = await axios.get("/api/v1/user", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${_token}`,
      },
    });
    if (res.status === 200) {
      return res.data.user;
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || error.message);
    } else if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("An unknown error occurred");
    }
  }
};
