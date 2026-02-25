const { Category } = require('../models');

const getCategories = async (req, res) => {
    try {
        const categories = await Category.findAll({
            order: [['name', 'ASC']]
        });
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const createCategory = async (req, res) => {
    try {
        const category = await Category.create(req.body);
        res.status(201).json(category);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateCategory = async (req, res) => {
    try {
        const { id, ...updates } = req.body;
        const [updated] = await Category.update(updates, {
            where: { id: id }
        });
        if (updated) {
            const updatedCategory = await Category.findByPk(id);
            res.status(200).json(updatedCategory);
        } else {
            res.status(404).json({ error: 'Category not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteCategory = async (req, res) => {
    try {
        const { id } = req.query;
        const deleted = await Category.destroy({
            where: { id: id }
        });
        if (deleted) {
            res.status(200).json({ message: 'Deleted successfully' });
        } else {
            res.status(404).json({ error: 'Category not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory
};
