const mongoose=require('mongoose')
const plm=require('passport-local-mongoose')

const userSchema=mongoose.Schema({
  name:String,
  email:String,
  username:String,
  password:String,
  profileImage:{
    type: String,
    default: "../images/uploads/def1.jpg"
  },
  cars:[{
    type: mongoose.Schema.Types.ObjectId,
    ref:'car'
  }]
})

userSchema.plugin(plm);
module.exports=mongoose.model('user',userSchema);
