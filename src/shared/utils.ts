import { setCookie } from "cookies-next";
import { getCookie } from "cookies-next/client";

export const saveToCookie = (key: string, value: any) => {
  setCookie(key, value, { maxAge: 15 * 60 });
};

export const getAuthData = (key: string): Record<string, string> | null => {
  const data = getCookie(key);

  try {
    if (!data) throw new Error("No cookie");
    const parsed = JSON.parse(data?.toString());
    return parsed;
  } catch (e) {
    console.error(e);
    return null;
  }
};
