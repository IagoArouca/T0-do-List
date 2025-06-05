const jwt = require('jsonwebtoken');
const User = require('../models/user.model.js');

const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Não autorizado: Token não encontrado.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId);

        if (!user) {
            return res.status(401).json({ message: 'Não autorizado: Usuário não encontrado.' });
        }

        req.user = { userId: user._id.toString() };

        next();
    } catch (error) {
    console.error('Erro ao autenticar token:', error);
    return res.status(401).json({ message: 'Não autorizado: Token inválido.' });
  }
};

module.exports = { authenticateToken };