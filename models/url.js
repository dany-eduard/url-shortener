import mongoose from 'mongoose'
const { Schema, model } = mongoose;

const urlSchema = new Schema({
  original_url: { type: String, required: true },
  short_url: { type: Number, required: true },
});

const Url = model('Url', urlSchema);
export default Url;
