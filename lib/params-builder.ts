export type Params = {
  [key: string]: string | undefined;
};

export default class ParamsBuilder {
  private params: Params;
  constructor(params: Params) {
    this.params = params;
  }

  toString() {
    return Object.entries(this.params)
      .map(([key, val]) => `${key}=${val ?? ""}`)
      .join("&");
  }
}
