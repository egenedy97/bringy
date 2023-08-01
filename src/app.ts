import cors from "cors";
import express from "express";
import { Routes } from "./interfaces/routes.interface";
import { ConnectOptions, connect, set } from "mongoose";
import dbConnection from "./databases";

class App {
  public app: express.Application;
  public env: string;
  public port: string | number;

  constructor(routes: Routes[]) {
    this.app = express();
    this.env = (process.env.NODE_ENV as string) || "development";
    this.port = (process.env.port as number | string) || 3000;
    this.initializeMiddlewares();
    this.initializeRoutes(routes);
    this.connectingDatabase();
  }

  public initializeMiddlewares() {
    // this.app.use(morgan(LOG_FORMAT, { stream }));
    this.app.use(cors());

    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }

  private connectingDatabase() {
    if (this.env !== "production") {
      set("debug", true);
    }
    try {
      connect(
        dbConnection.url as string,
        dbConnection.options as ConnectOptions
      );
      console.log("database is connected \n");
    } catch (e) {
      console.log("There is an error", e);
    }
  }
  private initializeRoutes(routes: Routes[]) {
    routes.forEach((route) => {
      this.app.use("/", route.router);
    });
  }
  public getServer() {
    return this.app;
  }
  public listen() {
    this.app.listen(this.port, () => {
      console.log(`=================================`);
      console.log(`======= ENV: ${this.env} =======`);
      console.log(`🚀 App listening on the port ${this.port}`);
      console.log(`=================================`);
    });
  }
}

export default App;
