import { AxiosResponse } from "axios";

import { RequestBuilder } from "@/request-builder";
import { Params } from "@/params-builder";

export type VKResponse = {
  response: {
    [key: string]: string;
  };
};

export type VKError = {
  error: {
    error_code: number;
    error_msg: string;
    request_params: Params[];
  };
};

export interface RequesterVKInstance {
  request(method: string, params: Params): Promise<AxiosResponse<VKResponse>>;

  sendMessage(param: Params): void;

  sendMessageEvent(param: Params): void;
}

export class RequesterVK implements RequesterVKInstance {
  private readonly token: string | undefined;
  private readonly version: string | undefined;
  private readonly defaultParams: {
    access_token: string | undefined;
    v: string | undefined;
  };

  constructor(token: string | undefined) {
    this.token = token;
    this.version = process.env.version;
    this.defaultParams = {
      access_token: this.token,
      v: this.version,
    };
  }

  request(method: string, params: Params): Promise<AxiosResponse<VKResponse>> {
    const url = `https://api.vk.com/method/${method}`;
    const builder = new RequestBuilder(url, {
      ...this.defaultParams,
      ...params,
    });
    return builder.post<VKResponse & VKError>().then((response) => {
      return new Promise((resolve, reject) =>
        response.data.error ? reject(response) : resolve(response)
      );
    });
  }

  sendMessage(params: Params) {
    return this.request("messages.send", {
      ...params,
      random_id: (Date.now() + Math.random()).toString(),
    });
  }

  sendMessageEvent(params: Params) {
    return this.request("messages.sendMessageEventAnswer", params);
  }
}
