import ParamsBuilder, { Params } from "./params-builder";
import { AxiosResponse } from "axios";
import FormData from "form-data";

const axios = require("axios");

export interface RequestBuilderInstance {
  get<T = any, R = AxiosResponse<T>>(): Promise<R>;

  post<T = any, R = AxiosResponse<T>>(): Promise<R>;
}

export class RequestBuilder implements RequestBuilderInstance {
  private readonly url: string;
  private readonly params: Record<string, any>;

  constructor(url: string, params: Params) {
    this.url = url;
    this.params = params;
  }

  get<T = any, R = AxiosResponse<T>>(): Promise<R> {
    return axios.get(`${this.url}?${new ParamsBuilder(this.params)}`);
  }

  post<T = any, R = AxiosResponse<T>>(): Promise<R> {
    const formData = new FormData();
    Object.keys(this.params).forEach((key) => {
      formData.append(key, this.params[key]);
    });
    return axios.post(this.url, formData, {
      headers: formData.getHeaders(),
    });
  }
}
