import App from "./app";
import UsersRoute from "./routes/user.route";
import AuthRoute from "./routes/auth.route";
import ContactRoute from "./routes/contact.route";

const app = new App([new UsersRoute(), new AuthRoute(), new ContactRoute()]);
app.listen();
