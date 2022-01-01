import Url from './models/url.js';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import isUrl from './utils/isUrl.js';

dotenv.config();

const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Database connected!');
  } catch (error) {
    console.error(error);
  }
})();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.post('/api/shorturl', async (req, res) => {
  const { url } = req.body;
  if (!isUrl(url)) return res.json({ error: 'invalid url' });

  const count = await Url.countDocuments({ short_url: { $gte: 0 } });
  const newUrl = new Url({ original_url: url, short_url: count });

  const { original_url, short_url } = await newUrl.save();
  res.json({ original_url, short_url });
});

app.get('/api/shorturl/:short', async (req, res) => {
  const { short } = req.params;
  console.log(' short', +short);
  const { original_url, short_url } = await Url.findOne({ short_url: +short });
  res.json({ original_url, short_url });
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
