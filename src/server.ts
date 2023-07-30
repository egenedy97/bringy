import App from "./app";
import UsersRoute from "./routes/user.route";
import AuthRoute from "./routes/auth.route";

const app = new App([new UsersRoute(), new AuthRoute()]);
app.listen();
