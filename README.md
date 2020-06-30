# Serverless Grocery List

This is a simple grocery list application using AWS Lambda and Serverless framework.

# Functionality of the application

This application allows creating/removing/updating/fetching items. Each item can optionally have an attachment image. Each user only has access to items that he/she has created.

# Items

The application store items, and each item contains the following fields:

* `itemId` (string) - a unique id for an item
* `createdAt` (string) - date and time when an item was created
* `name` (string) - name of an item (e.g. "A bag of bread")
* `dueDate` (string) - date and time by which an item should be bought
* `done` (boolean) - true if an item was bought, false otherwise
* `attachmentUrl` (string) (optional) - a URL pointing to an image attached to an item

It is also storing an id of a user who created an item.


# Functions

The following functions are implemented and configured in the `serverless.yml` file:

* `Auth` - this function implements a custom authorizer for API Gateway that is added to all other functions.

* `GetTodos` - should return all items for a current user.

It returns data that looks like this:

```json
{
  "items": [
    {
      "itemId": "123",
      "createdAt": "2020-06-27T20:01:45.424Z",
      "name": "A gallon of milk",
      "dueDate": "2020-07-01T20:01:45.424Z",
      "done": false,
      "attachmentUrl": "http://example.com/image.png"
    },
    {
      "itemId": "456",
      "createdAt": "2020-06-28T20:01:45.424Z",
      "name": "2 boxes of cereal",
      "dueDate": "2020-07-02T20:01:45.424Z",
      "done": true,
      "attachmentUrl": "http://example.com/image.png"
    },
  ]
}
```

* `CreateTodo` - Creates a new item for a current user.

It receives a new item to be created in JSON format that looks like this:

```json
{
  "createdAt": "2020-06-27T20:01:45.424Z",
  "name": "A gallon of milk",
  "dueDate": "2020-07-01T20:01:45.424Z",
  "done": false,
  "attachmentUrl": "http://example.com/image.png"
}
```

It returns a new item that looks like this:

```json
{
  "item": {
    "itemId": "123",
    "createdAt": "2020-07-01T20:01:45.424Z",
    "name": "A gallon of milk",
    "dueDate": "2020-07-01T20:01:45.424Z",
    "done": false,
    "attachmentUrl": "http://example.com/image.png"
  }
}
```

* `UpdateTodo` - It updates an item created by a current user.

It receives an object that contains three fields that can be updated in an item:

```json
{
  "name": "A bag of  bread",
  "dueDate": "2020-06-29T20:01:45.424Z",
  "done": true
}
```

The id of an item that should be updated is passed as a URL parameter.

It returns an empty body.

* `DeleteTodo` - it deletes an item created by a current user. Expects an id of an item to remove.

It should return an empty body.

* `GenerateUploadUrl` - returns a pre-signed URL that can be used to upload an attachment file for an item.

It should return a JSON object that looks like this:

```json
{
  "uploadUrl": "https://s3-bucket-name.s3.eu-west-2.amazonaws.com/image.png"
}
```


# Frontend

The `client` folder contains a web application that uses the backend API.

This frontend works with the serverless application.

```ts
const apiId = '...' API Gateway id
export const apiEndpoint = `https://${apiId}.execute-api.us-east-1.amazonaws.com/dev`

export const authConfig = {
  domain: '...',    // Domain from Auth0
  clientId: '...',  // Client id from an Auth0 application
  callbackUrl: 'http://localhost:3000/callback'
}
```

## Authentication

Authentication is implemented with an Auth0 application.


# How to run the application

## Backend

To deploy an application run the following commands:

```
cd backend
npm install
sls deploy -v
```

## Frontend

```
cd client
npm install
npm run start
```

This should start a development server with the React application that will interact with the serverless groceries list application.

