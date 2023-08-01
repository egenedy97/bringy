import { NextFunction, Request, Response } from "express";
import contactService from "../services/contact.service";
import mongoose, { FilterQuery } from "mongoose";
import { IContact } from "models/contact.model";

class ContactsController {
  public contactService = new contactService();

  public createContact = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      let contactData = req.body;

      contactData.userId = new mongoose.Types.ObjectId(
        //@ts-ignore

        req?.user._id
      ).toString();
      console.log(contactData);
      const createContactData = await this.contactService.createContact(
        contactData
      );
      res.status(201).json({ data: createContactData, message: "created" });

      res;
    } catch (error) {
      next(error);
    }
  };

  public getAllContact = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const sortField = (req.query.sortField as string) || "firstName"; // Assuming createdAt is the field to sort contacts by
      const sortOrder: any = (req.query.sortOrder as string) || "asc";
      const filter: FilterQuery<IContact> = req.query;
      const contactsData = await this.contactService.getAllContact(
        page,
        limit,
        sortField,
        sortOrder,
        filter
      );
      res
        .status(200)
        .json({ data: contactsData, message: "Contacts fetched successfully" });
    } catch (error) {
      next(error);
    }
  };

  public getContactById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const contactId = req.params.id;
      const contact = await this.contactService.getOneContact(contactId);
      res
        .status(200)
        .json({ data: contact, message: "Contact fetched successfully" });
    } catch (error) {
      next(error);
    }
  };

  public updateOneContact = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const contactId = req.params.id;
      const updateData: Partial<IContact> = req.body;
      const updatedContact = await this.contactService.updateOneContact(
        contactId,
        updateData
      );
      res.status(200).json({
        data: updatedContact,
        message: "Contact updated successfully",
      });
    } catch (error) {
      next(error);
    }
  };

  public deleteOneContact = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const contactId = req.params.id;
      const deletedContact = await this.contactService.deleteOneContact(
        contactId
      );
      res.status(200).json({
        data: deletedContact,
        message: "Contact deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  };
}

export default ContactsController;
