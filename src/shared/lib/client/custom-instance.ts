import { AxiosError } from "axios";
import { axiosApi } from "./axios-client";

const customInstance = <T>(config: any): Promise<T> => {
  return axiosApi(config)
    .then(({ data }) => data)
    .catch((e) => {
      const err = e as AxiosError<{ message: string, errors: Record<string, string> }>;

      throw err;
    });
};
export type ErrorType<ErrorResponse> = AxiosError<ErrorResponse & { errors: Record<string, string> }>;

export default customInstance;
