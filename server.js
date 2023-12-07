const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/formBuilderDB', { useNewUrlParser: true, useUnifiedTopology: true });

const formSchema = new mongoose.Schema({
  title: String,
  categories: [
    {
      title: String,
      items: [
        {
          text: String,
          categories: [String],
          order: Number,
          description: String,
          feedback: String,
          points: Number,
        },
      ],
    },
  ],
});

const Form = mongoose.model('Form', formSchema);

app.post('/api/forms', async (req, res) => {
  try {
    const form = new Form(req.body);
    await form.save();
    res.json(form);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.get('/api/forms/:id', async (req, res) => {
  try {
    const form = await Form.findById(req.params.id);
    res.json(form);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
