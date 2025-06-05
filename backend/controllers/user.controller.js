const User = require('../models/user.model.js');

exports.getMe = async (req, res) => {
    try {
      const user = await User.findById(req.user.userId).select('-password');
      if(!user) {
        return res.status(404).json({ message: 'Usuário não encontrado.' });
      }  
      res.status(200).json(user);
    } catch (error) {
        console.error('Erro ao obter informações do usuário:', error);
        res.status(500).json({ message: 'Erro ao obter informações do usuário.' });
    }
};

exports.updateMe = async (req,res) => {
    try {
        const { username, email } = req.body;
        const updatedUser = await User.findByIdAndUpdate(
            req.user.userId,
            { username, email },
            { new: true }
        ).select('-password');

        if (!updatedUser) {
            return res.status(404).json({ message: 'Usuário não encontrado.' });
        }
        res.status(200).json(updatedUser);
    } catch (error) {
        console.error('Erro ao atualizar informações do usuário:', error);
        res.status(500).json({ message: 'Erro ao atualizar informações do usuário.' });

    }
};