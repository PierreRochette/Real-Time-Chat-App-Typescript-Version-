import mongoose from 'mongoose'; 
import { db_key } from './dblogin';

const connect_database = () => {

    mongoose.connect(db_key)
    .then(() => console.log('Connected to MongoDB Atlas'))
    .catch(err => console.error('Error connecting MongoDb Atlas', err));
} 

export { connect_database }; 