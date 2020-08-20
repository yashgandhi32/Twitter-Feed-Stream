var  mongoose  = require('mongoose')

// DB Config
const db = 'mongodb://localhost:27017/tweets'

// Connect to MongoDB
mongoose
    .connect(db, { useNewUrlParser: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.log(err));
