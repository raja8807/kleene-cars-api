const { Product } = require('../models');

const getProducts = async (req, res) => {
    try {
        const products = await Product.findAll({
            order: [['name', 'ASC']]
        });
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const createProduct = async (req, res) => {
    try {
        const product = await Product.create(req.body);
        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateProduct = async (req, res) => {
    try {
        const { id } = req.body; // or req.params depending on route setup, mimicking existing behavior which uses body for update
        const [updated] = await Product.update(req.body, {
            where: { id: id }
        });
        if (updated) {
            const updatedProduct = await Product.findByPk(id);
            res.status(200).json(updatedProduct);
        } else {
            res.status(404).json({ error: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteProduct = async (req, res) => {
    try {
        const { id } = req.query; // mimicking existing behavior which uses query for delete
        const deleted = await Product.destroy({
            where: { id: id }
        });
        if (deleted) {
            res.status(200).json({ message: 'Deleted successfully' });
        } else {
            res.status(404).json({ error: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getProducts,
    createProduct,
    updateProduct,
    deleteProduct
};
