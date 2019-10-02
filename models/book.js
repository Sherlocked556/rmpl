var mongoose=require('mongoose');
const BookSchema={
    name:{type:String,required:true,unique:true},
    author:{type:String,require:true},
    genere:[{type:String}],
    pic:{type:String},

}
module.exports=mongoose.model('Book',BookSchema);