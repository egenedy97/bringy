import AuthService from "../services/auth.service";
import AuthController from "../controllers/auth.controller";

describe("AuthController", () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(() => {
    authService = new AuthService();
    authController = new AuthController();
    authController.authService = authService;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("signUp", () => {
    it("should return a 201 status code and the created user data", async () => {
      const userData = {
        name: "John Doe",
        email: "john.doe@example.com",
        password: "PASsword12",
      };
      const req = { body: userData } as any;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as any;
      const next = jest.fn();
      jest
        .spyOn(authService, "signup")
        .mockResolvedValue({ ...userData, _id: "64c83aaa7f4fc1cc59f510bf" });

      await authController.signUp(req, res, next);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        data: { ...userData, _id: "64c83aaa7f4fc1cc59f510bf" },
        message: "signup",
      });
    });
  });
});
