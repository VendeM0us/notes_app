import mongoose from "mongoose";
import dotenv from 'dotenv';

dotenv.config();

const password = process.env.PASSWORD;

const url = `mongodb+srv://VendeMous:${password}@cluster0.mkfudt6.mongodb.net/noteApp?retryWrites=true&w=majority`;

const noteSchema = new mongoose.Schema({
  content: String,
  date: Date, 
  important: Boolean,
});

const Note = mongoose.model('Note', noteSchema);

mongoose.connect(url);

Note.find({}).then(result => {
  result.forEach(note => console.log(note));
  mongoose.connection.close();
})