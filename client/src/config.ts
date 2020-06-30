// TODO: Once your application is deployed, copy an API id here so that the frontend could interact with it
const apiId = 'lunh8zmg49'
export const apiEndpoint = `https://${apiId}.execute-api.us-east-2.amazonaws.com/dev`

export const authConfig = {
  // TODO: Create an Auth0 application and copy values from it into this map
  domain: 'dev-kbdy9laj.us.auth0.com',            // Auth0 domain
  clientId: '6NDTbxGtBa33n4DV7YhsjzRGq55Y5ru3',          // Auth0 client id
  callbackUrl: 'http://localhost:3000/callback'
}
