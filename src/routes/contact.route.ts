import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware";
import { Routes } from "../interfaces/routes.interface";
import ContactsController from "../controllers/contact.controller";

class ContactRoute implements Routes {
  public path = "/contacts";
  public router = Router();
  public ContactsController = new ContactsController();
  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      `${this.path}`,
      authMiddleware,
      this.ContactsController.createContact
    );
    this.router.get(
      `${this.path}`,
      authMiddleware,
      this.ContactsController.getAllContact
    );
    this.router.get(
      `${this.path}/:id`,
      authMiddleware,
      this.ContactsController.getContactById
    );
    this.router.put(
      `${this.path}/:id`,
      authMiddleware,
      this.ContactsController.updateOneContact
    );
    this.router.delete(
      `${this.path}/:id`,
      authMiddleware,
      this.ContactsController.deleteOneContact
    );
  }
}

export default ContactRoute;
