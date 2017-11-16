const mongoose = require('mongoose');


mongoose.Promise= Promise;

mongoose.connect('mongodb://localhost/express-users',{useMongoClient: true})
.then(()=>{
  console.log('mongoose connected!');
})
.catch((err)=>{

  console.log(err);
  console.log("error");
});
