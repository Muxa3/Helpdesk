import Bazaznaniy from '../models/bazaznaniyModel.js';

// Получить все записи базы знаний
export const getAllBazaznaniy = async (req, res) => {
    try {
        const bazaznaniy = await Bazaznaniy.find().populate('userId', 'username');
        res.json(bazaznaniy);
    } catch (error) {
        res.status(500).json({ message: 'Ошибка при получении записей базы знаний' });
    }
};

// Создать новую запись
export const createBazaznaniy = async (req, res) => {
    try {
        const { title, body } = req.body;
        const bazaznaniy = new Bazaznaniy({
            title,
            body,
            userId: req.user._id
        });
        const savedBazaznaniy = await bazaznaniy.save();
        res.status(201).json(savedBazaznaniy);
    } catch (error) {
        res.status(400).json({ message: 'Ошибка при создании записи' });
    }
};

// Обновить запись
export const updateBazaznaniy = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, body } = req.body;
        const updatedBazaznaniy = await Bazaznaniy.findByIdAndUpdate(
            id,
            { title, body },
            { new: true }
        );
        if (!updatedBazaznaniy) {
            return res.status(404).json({ message: 'Запись не найдена' });
        }
        res.json(updatedBazaznaniy);
    } catch (error) {
        res.status(400).json({ message: 'Ошибка при обновлении записи' });
    }
};

// Удалить запись
export const deleteBazaznaniy = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedBazaznaniy = await Bazaznaniy.findByIdAndDelete(id);
        if (!deletedBazaznaniy) {
            return res.status(404).json({ message: 'Запись не найдена' });
        }
        res.json({ message: 'Запись успешно удалена' });
    } catch (error) {
        res.status(400).json({ message: 'Ошибка при удалении записи' });
    }
}; 