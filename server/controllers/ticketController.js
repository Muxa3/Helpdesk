import Ticket from "../models/ticketModel.js";

// Create new ticket
export const createTicket = async (req, res) => {
    try {
        const ticket = new Ticket({
            ...req.body,
            userId: req.user._id
        });
        await ticket.save();
        // Популируем данные пользователя при создании
        const populatedTicket = await Ticket.findById(ticket._id).populate('userId', 'username');
        res.status(201).json(populatedTicket);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get all tickets based on user role
export const getAllTickets = async (req, res) => {
    try {
        let tickets;
        console.log('User status:', req.user.status);
        console.log('User ID:', req.user._id);

        if (req.user.status === 'user') {
            // Regular users can only see their own tickets
            tickets = await Ticket.find({ userId: req.user._id.toString() }).populate('userId', 'username');
            console.log('Found tickets for user:', tickets);
        } else if (req.user.status === 'support') {
            // Support can see all non-closed tickets
            tickets = await Ticket.find({ status: { $ne: 'closed' } }).populate('userId', 'username');
        } else {
            // Admin can see all tickets
            tickets = await Ticket.find().populate('userId', 'username');
        }
        res.status(200).json(tickets);
    } catch (error) {
        console.error('Error in getAllTickets:', error);
        res.status(500).json({ message: error.message });
    }
};

// Get ticket by ID
export const getTicketById = async (req, res) => {
    try {
        const ticket = await Ticket.findById(req.params.id).populate('userId', 'username');
        if (!ticket) {
            return res.status(404).json({ message: "Тикет не был найден" });
        }

        // Check if user has permission to view this ticket
        if (req.user.status === 'user' && ticket.userId._id.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Недостаточно прав для просмотра тикета" });
        }

        res.status(200).json(ticket);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update ticket status
export const updateTicketStatus = async (req, res) => {
    try {
        const ticket = await Ticket.findById(req.params.id);
        if (!ticket) {
            return res.status(404).json({ message: "Тикет не был найден" });
        }

        // Проверка прав доступа
        if (req.user.status === 'user' && ticket.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Недостаточно прав для обновления тикета" });
        }

        const { status, priorityRating } = req.body;
        
        // Обновляем статус используя метод схемы
        await ticket.updateStatus(status, priorityRating);

        // Получаем обновленный тикет
        const updatedTicket = await Ticket.findById(ticket._id).populate('userId', 'username');
        res.status(200).json(updatedTicket);
    } catch (error) {
        console.error('Error in updateTicketStatus:', error);
        res.status(500).json({ message: error.message });
    }
};

// Delete ticket
export const deleteTicket = async (req, res) => {
    try {
        const ticket = await Ticket.findById(req.params.id);
        if (!ticket) {
            return res.status(404).json({ message: "Тикет не был найден" });
        }

        // Only admin can delete tickets
        if (req.user.status !== 'admin') {
            return res.status(403).json({ message: "Только администратор может удалять тикеты" });
        }

        await Ticket.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Тикет удален успешно" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}; 