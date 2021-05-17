const {connect} = require('mongoose')

const dbURI = process.env.DATABASE

connect(dbURI,{ useNewUrlParser:true,useNewUrlParser:true,useCreateIndex:true,useFindAndModify:true}).then(()=>console.log('Database connection established'))