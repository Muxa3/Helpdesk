import express from "express";
import {
    createTicket,
    getAllTickets,
    getTicketById,
    updateTicketStatus,
    deleteTicket
} from "../controllers/ticketController.js";
import { protect, authorize } from "../middleware/auth.js";

const route = express.Router();

// All routes are protected
route.use(protect);

// Regular user routes
route.post("/", createTicket);
route.get("/", getAllTickets);
route.get("/:id", getTicketById);
route.put("/:id", updateTicketStatus);

// Admin only route
route.delete("/:id", authorize('admin'), deleteTicket);

export default route;