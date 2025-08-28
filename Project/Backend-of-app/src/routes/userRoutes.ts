import { Router } from "express";
import usercontroller from "../controllers/userController";
import detailController from "../controllers/detailController";

const { getDetails, getDetailsById, createDetail, updateDetail, deleteDetail } = detailController;

const { getUsers, getUserById, createUser, updateUser, deleteUser, getUserWithDetails } = usercontroller;
const router = Router();


/* ----------------- USER ROUTES ----------------- */
router.get("/users", getUsers);
router.get("/users/:id", getUserById);
router.post("/users", createUser);
router.put("/users/:id", updateUser);
router.delete("/users/:id", deleteUser);
// 👇 Join query route
router.get("/users/:id/details", getUserWithDetails);

/* ----------------- DETAIL ROUTES ----------------- */
router.get("/details", getDetails);
router.post("/details", createDetail);
router.get("/details/:id", getDetailsById);
router.put("/details/:id", updateDetail);
router.delete("/details/:id", deleteDetail)

export default router;
