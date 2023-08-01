import ContactService from "../services/contact.service";
import { IContact } from "../models/contact.model";

// Mock the Contact model
jest.mock("../models/contact.model", () => ({
  Contact: {
    create: jest.fn(),
    countDocuments: jest.fn(),
    find: jest.fn(),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
  },
}));

// Helper function to create a mocked Contact instance
const createMockedContact = (data: Partial<IContact>): IContact => {
  const contact: any = {
    _id: "contact_id",
    firstName: "John",
    lastName: "Doe",
    phoneNumber: "1234567890",
    email: "john.doe@example.com",
    birthdate: new Date(),
    userId: "64c83aaa7f4fc1cc59f510bf",
    ...data,
  };
  return contact;
};

describe("ContactService", () => {
  let contactService: ContactService;

  beforeEach(() => {
    contactService = new ContactService();
  });

  describe("createContact", () => {
    it("should create a new contact", async () => {
      // Mocking the data for the new contact
      const contactData: any = {
        firstName: "John",
        lastName: "Doe",
        phoneNumber: "1234567890",
        email: "john.doe@example.com",
        birthdate: new Date(),
        userId: "user_id",
      };

      const savedContact = createMockedContact(contactData);
      (contactService.contact.create as jest.Mock).mockResolvedValue(
        savedContact
      );

      const createdContact = await contactService.createContact(contactData);

      expect(contactService.contact.create).toHaveBeenCalledWith(contactData);
      expect(createdContact).toEqual(savedContact);
    });

    it("should handle errors and throw an exception", async () => {
      const contactData = {
        firstName: "John",
        lastName: "Doe",
        phoneNumber: "1234567890",
        email: "john.doe@example.com",
        birthdate: new Date(),
        userId: "user_id",
      };

      const errorMessage = "Mocked error message";
      (contactService.contact.create as jest.Mock).mockRejectedValue(
        new Error(errorMessage)
      );

      try {
        await contactService.createContact(contactData);

        fail("Expected an error, but none was thrown.");
      } catch (error) {
        // Assertion
        expect(error.message).toBe(errorMessage);
      }
    });
  });

  describe("getAllContact", () => {
    it("should get all contacts with default parameters", async () => {
      const page = 1;
      const limit = 10;
      const sortField = "firstName";
      const sortOrder = "asc";
      const filter = {};

      const totalContacts = 2;
      const allContacts: any = [
        createMockedContact({
          _id: "contact1_id",
          firstName: "John",
          lastName: "Doe",
          phoneNumber: "1234567890",
          email: "john.doe@example.com",
          birthdate: new Date(),
          //@ts-ignore
          userId: "64c83aaa7f4fc1cc59f510bf",
        }),
        createMockedContact({
          _id: "contact2_id",
          firstName: "Jane",
          lastName: "Doe",
          phoneNumber: "1234567891",
          email: "john.doe@example.com",
          birthdate: new Date(),
          //@ts-ignore

          userId: "64c83aaa794fc1cc59f510bf",
        }),
      ];
      (contactService.contact.countDocuments as jest.Mock).mockResolvedValue(
        totalContacts
      );
      (contactService.contact.find as jest.Mock).mockResolvedValue(allContacts);

      const result = await contactService.getAllContact(
        page,
        limit,
        sortField,
        sortOrder,
        filter
      );

      expect(contactService.contact.countDocuments).toHaveBeenCalledWith(
        filter
      );
      expect(contactService.contact.find).toHaveBeenCalledWith(filter);
      expect(result.totalContacts).toBe(totalContacts);
      expect(result.totalPages).toBe(1);
      expect(result.currentPage).toBe(page);
      expect(result.contacts).toEqual(allContacts);
    });

    it("should get all contacts with custom parameters", async () => {
      const page = 2;
      const limit = 5;
      const sortField = "lastName";
      const sortOrder = "desc";
      const filter = { firstName: "John" };

      const totalContacts = 1;
      const allContacts = [
        createMockedContact({
          _id: "contact1_id",
          firstName: "John",
          lastName: "Doe",
          phoneNumber: "1234567891",
          email: "john.doe@example.com",
          birthdate: new Date(),
          //@ts-ignore

          userId: "64c83aaa7f4fc1cc59f510bf",
        }),
      ];
      (contactService.contact.countDocuments as jest.Mock).mockResolvedValue(
        totalContacts
      );
      (contactService.contact.find as jest.Mock).mockResolvedValue(allContacts);

      const result = await contactService.getAllContact(
        page,
        limit,
        sortField,
        sortOrder,
        filter
      );

      expect(contactService.contact.countDocuments).toHaveBeenCalledWith(
        filter
      );
      expect(contactService.contact.find).toHaveBeenCalledWith(filter);
      expect(result.totalContacts).toBe(totalContacts);
      expect(result.totalPages).toBe(1);
      expect(result.currentPage).toBe(page);
      expect(result.contacts).toEqual(allContacts);
    });

    it("should handle errors and throw an exception", async () => {
      const page = 1;
      const limit = 10;
      const sortField = "dASDa";
      const sortOrder = "asc";
      const filter = {};

      const errorMessage = "Unable to fetch contacts";
      (contactService.contact.countDocuments as jest.Mock).mockRejectedValue(
        new Error(errorMessage)
      );

      try {
        await contactService.getAllContact(
          page,
          limit,
          sortField,
          sortOrder,
          filter
        );

        fail("Expected an error, but none was thrown.");
      } catch (error) {
        expect(error.message).toBe(errorMessage);
      }
    });
  });
});
