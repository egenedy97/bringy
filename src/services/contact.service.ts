import { Contact, IContact } from "../models/contact.model";
import { HttpException } from "../exceptions/HttpException";
import { FilterQuery } from "mongoose";

class ContactService {
  public contact = Contact;

  public async createContact(contactData: {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    email: string;
    birthdate: Date;
    userId: string;
  }) {
    const { firstName, lastName, phoneNumber, email, birthdate, userId } =
      contactData;

    const savedContact = this.contact.create({
      firstName,
      lastName,
      phoneNumber,
      email,
      birthdate,
      userId,
    });

    return savedContact;
  }

  public async getAllContact(
    page: number,
    limit: number,
    sortField: string,
    sortOrder: "asc" | "desc",
    filter: FilterQuery<IContact> // New parameter for the filter criteria
  ) {
    const skipCount = (page - 1) * limit;
    const sortOptions: any = { [sortField]: sortOrder === "asc" ? 1 : -1 };

    try {
      const totalContacts = await this.contact.countDocuments(filter); // Apply the filter to count only the matching contacts
      const allContacts = await this.contact
        .find(filter) // Apply the filter to fetch only the matching contacts
        .sort(sortOptions)
        .skip(skipCount)
        .limit(limit)
        .populate("userId");

      return {
        totalContacts,
        totalPages: Math.ceil(totalContacts / limit),
        currentPage: page,
        contacts: allContacts,
      };
    } catch (error) {
      console.log(error);
      throw new HttpException(500, "Unable to fetch contacts");
    }
  }
  public async getOneContact(contactId: string) {
    try {
      const contact = await this.contact.findById(contactId).populate("userId");

      if (!contact) {
        throw new HttpException(404, "Contact not found");
      }

      return contact;
    } catch (error) {
      throw new HttpException(500, "Unable to fetch contact");
    }
  }

  public async updateOneContact(
    contactId: string,
    updateData: Partial<IContact>
  ) {
    try {
      const updatedContact = await this.contact
        .findByIdAndUpdate(contactId, updateData, {
          new: true,
        })
        .populate("userId");

      if (!updatedContact) {
        throw new HttpException(404, "Contact not found");
      }

      return updatedContact;
    } catch (error) {
      throw new HttpException(500, "Unable to update contact");
    }
  }

  public async deleteOneContact(contactId: string) {
    try {
      const deletedContact = await this.contact
        .findByIdAndDelete(contactId)
        .populate("userId");

      if (!deletedContact) {
        throw new HttpException(404, "Contact not found");
      }

      return deletedContact;
    } catch (error) {
      throw new HttpException(500, "Unable to delete contact");
    }
  }
}

export default ContactService;
