# How to run Zitadel

1. Run `docker compose up` to start the services
2. Open your browser and go to `http://localhost:8080` to access the Zitadel console.
3. Use the following credentials to log in:
    - **Email**: `zitadel-admin@zitadel.localhost`
    - **Password**: `Password1!`
4. Setup a new application:
    1. Enter "YACRS" into project and 'OTHER' into framework.
    2. Enter "YACRS-web" into application name and select "Web" as the type.
    3. Select PKCE as the authentication method.
    4. Enter "http://localhost:5173" and "http://localhost:5173/api/auth/oauth2/callback/zitadel" as the redirect URIs and enable development mode.
    5. Copy the client ID and paste it into .env file
    6. In the project page select all options under "response types" and "grant types"

That's all