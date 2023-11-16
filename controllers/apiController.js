const db = require('../dataBase/models');

const apiController = {
  getAllUsers: async (req, res) => {
    const users = await db.User.findAll({ attributes: ['id', 'username', 'email'] });
    const usersWithDetail = users.map(user => ({
      id: user.id,
      name: user.username,
      email: user.email,
      detail: `/api/users/${user.id}`
    }));
    res.json({
      count: users.length,
      users: usersWithDetail
    });
  },

  getUserById: async (req, res) => {
    const userId = req.params.id;
    const user = await db.User.findByPk(userId, { attributes: { exclude: ['password', 'category'] } });
    if (user) {
      const userProfile = {
        id: user.id,
        name: user.username,
        email: user.email,
        profileImage: `/api/users/${user.id}/image`
      };
      res.json(userProfile);
    } else {
      res.status(404).json({ error: 'Usuario no encontrado' });
    }
  },

  getUserImageById: async (req, res) => {
    const userId = req.params.id;
    const user = await db.User.findByPk(userId, { attributes: ['img'] });
    if (user && user.img) {
      const imagePath = `/images/${user.img}`;
      res.sendFile(imagePath);
    } else {
      res.status(404).json({ error: 'Imagen no encontrada' });
    }
  },

  getAllProducts: async (req, res) => {
    const products = await db.Product.findAll({
      attributes: ['id', 'name', 'description', 'price', 'discount', 'enOferta', 'img', 'class', 'sex', 'sizes'],
      include: []
    });
    const productsWithDetail = products.map(product => ({
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      discount: product.discount,
      enOferta: product.enOferta,
      img: product.img,
      class: product.class,
      sex: product.sex,
      sizes: product.sizes.split(','),
      detail: `/api/products/${product.id}`
    }));
    const countByCategory = {};
    res.json({
      count: products.length,
      countByCategory,
      products: productsWithDetail
    });
  },

  getProductById: async (req, res) => {
    const productId = req.params.id;
    const product = await db.Product.findByPk(productId, {
      attributes: ['id', 'name', 'description', 'price', 'discount', 'enOferta', 'img', 'class', 'sex', 'sizes'],
      include: []
    });
    if (product) {
      const productDetails = {
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        discount: product.discount,
        enOferta: product.enOferta,
        img: product.img,
        class: product.class,
        sex: product.sex,
        sizes: product.sizes.split(',')
      };
      res.json(productDetails);
    } else {
      res.status(404).json({ error: 'Producto no encontrado' });
    }
  },

  getAllCategories: async (req, res) => {
    const products = await db.Product.findAll({ attributes: ['class'] });
    const productsCategories = products.map(product => product.class);
    const uniqueCategories = productsCategories.filter((cat, index) => productsCategories.indexOf(cat) === index);
    
    res.json({
      count: uniqueCategories.length,
      categories: uniqueCategories
    });
  },

  getCategoryById: async (req, res) => {
    const categoryId = req.params.id;
    const products = await db.Product.findAll({ attributes: ['class'] });
    const productsCategories = products.map(product => product.class);
    const uniqueCategories = productsCategories.filter((cat, index) => productsCategories.indexOf(cat) === index);

    // const searchedCategory = uniqueCategories.find(cat => cat === categoryId);
    const searchedCategory = uniqueCategories[categoryId];
    if(!searchedCategory) {
      return res.status(404).json({ error: 'Categoría no encontrada' });
    }
    const productsByCategory = await db.Product.findAll({ where: { class: searchedCategory } });

    res.json({
      count: productsByCategory.length,
      searchedCategory,
    })
  }
};

module.exports = apiController;
