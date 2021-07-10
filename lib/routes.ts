import { Express, NextFunction, Request, Response } from "express";
import { RequesterVK, VKError } from "@/requester-vk";
import ParamsBuilder, { Params } from "./params-builder";
import { RequestBuilder } from "./request-builder";
import axios, { AxiosError } from "axios";

export function routes(app: Express) {
  function authorizedMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    if (req.session.access_token) {
      next();
    } else {
      res.send('no token. please go to <a href="/auth">auth</a>');
    }
  }

  const host = process.env.host;
  const callback_auth = process.env.callback_method;
  const redirect_uri = `${host}/${callback_auth}`;

  app.get(`/${callback_auth}`, (req, res) => {
    const url = "https://oauth.vk.com/access_token";
    const code = req.query.code;
    const params: Params = {
      client_id: process.env.client_id,
      client_secret: process.env.client_secret,
      code: code as string,
      redirect_uri: redirect_uri,
    };
    type userData = {
      access_token: string;
      user_id: string;
      expires_in: string;
    };
    new RequestBuilder(url, params)
      .get()
      .then(function (response: { data: userData }) {
        req.session.access_token = response.data.access_token;
        req.session.user_id = +response.data.user_id;
        req.session.cookie.maxAge = +response.data.expires_in * 1000;
        res.redirect("/");
      })
      .catch((error: VKError | AxiosError) => {
        if (axios.isAxiosError(error)) {
          res.json(error);
        } else {
          res.json(error);
        }
      });
  });

  app.get("/auth", (req, res) => {
    const url = "http://oauth.vk.com/authorize";
    const params = {
      client_id: process.env.client_id,
      redirect_uri: redirect_uri,
      response_type: "code",
      scope: process.env.scope,
    };
    res.redirect(url + "?" + new ParamsBuilder(params));
  });

  app.get("/request/:method", authorizedMiddleware, (req, res) => {
    new RequesterVK(req.session.access_token)
      .request(req.params.method, req.query as Params)
      .then((response) => res.json(response.data.response))
      .catch((error: VKError | AxiosError) => {
        if (axios.isAxiosError(error)) {
          res.json(error);
        } else {
          res.json(error);
        }
      });
  });

  app.get("/", authorizedMiddleware, (req, res) => {
    res.send("example of request to vk: /request/method?params");
  });
}
