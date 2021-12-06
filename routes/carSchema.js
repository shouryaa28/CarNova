const mongoose=require('mongoose')

mongoose.connect('mongodb://localhost/carsell')
const carSchema = mongoose.Schema({
    carname: String,
    carprice: String,
    contact: String,
    carimg: String,
    sellerid:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'user'
    }
})
const carModel= mongoose.model('car',carSchema)

module.exports=carModel;


//first things first create one user

// userModel.create({
//   name:'harsh',
//   age:'20',
//   books:[]
// }).then(function(userCreated){
//   console.log(userCreated);
// })


//populate
// userModel.findOne({_id: '5fe362951193572f84f391a9'})
// .populate('books').exec(function(err,data){
//   console.log(data);
// });

//reference 
// userModel.findOne({_id:'5fe362951193572f84f391a9'})
// .then(function(foundUser){
//   bookModel.create({
//     price:"320$",
//     bookname:'labra',
//     author:foundUser._id
//   }).then(function(createdBook){
//     foundUser.books.push(createdBook);
//     foundUser.save().then(function(){
//       console.log(foundUser+'/n');
//       console.log(createdBook);
//     })
//   })
// })

//pagination example
// userModel.find().limit(3).skip(2)
// .then(function(foundlistofusers){
//   console.log(foundlistofusers);
// })


//paginate with mongoose js
// var perPage = 10
//   , page = Math.max(0, req.param('page'))

// Event.find()
//     .select('name')
//     .limit(perPage)
//     .skip(perPage * page)
//     .sort({
//         name: 'asc'
//     })
//     .exec(function(err, events) {
//         Event.count().exec(function(err, count) {
//             res.render('events', {
//                 events: events,
//                 page: page,
//                 pages: count / perPage
//                 //Math.seal() se max value aati h
//             })
//         })
//     })




