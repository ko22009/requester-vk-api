#Requester to vk api. user + group

- mongoDB (for persistence session)
- express
- axios

nodejs vk api with session storage mongoDB.  
copy .env.example to .env and change to your vars.

You can test locally, create app with local address in vk.  
Root page of the server will be return url for getting token if you have not.  
If you authorized, return to you example of request.

### Install

1. npm install
2. copy .env.example to .env (and change parameters your app)
3. npm start

### Examples:

Url for getting token: `/auth`

If you get list of the friend, you need request to local url with params:
`/request/method?params`  
method - friends.get  
"?params" - optional. params of the method.
