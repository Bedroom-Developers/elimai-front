import { AxiosError } from "axios";
import { axiosApi } from "./axios-client";


export const customInstance = <T>(config: any): Promise<T> => {
  return axiosApi(config)
    .then(({ data }) => data)
    .catch((e) => {
      const err = e as AxiosError<Record<string, string>>;

      throw err;
    });
};
export type ErrorType<ErrorResponse> = AxiosError<ErrorResponse>;

