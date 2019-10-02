var mongoose=require('mongoose');
const UserSchema={
    username:{type:String,required:true,unique:true},
    password:{type:String,required:true},
    email:{type:String,required:true},
    location:{type:String,require:true},
    book:[
        {bookname:{type:String},
        genere:{type:String}
    }
    
    ],
    intrest:[{type:String}],
    requests:[
{
    user:{type:String},
    status:{type:String}

 } ]
}
module.exports=mongoose.model('User',UserSchema);