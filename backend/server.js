const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv').config();
const authRoutes = require('./routes/auth.routes.js');
const userRoutes = require('./routes/user.routes.js');
const taskListRoutes = require('./routes/taskList.routes.js');
const taskRoutes = require('./routes/task.routes.js');


const app = express();
const port = process.env.PORT || 5000;
app.use(express.json());
const cors = require('cors');
app.use(cors());

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB conectado com sucesso!'))
.catch((err) => console.error('Erro ao conectar ao MongoDB:', err));

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/tasklists', taskListRoutes);
app.use('/api/tasks', taskRoutes);

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});

