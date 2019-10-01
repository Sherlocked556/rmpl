var mongoose=require('mongoose');
const UserSchema={
    username1:{type:String,required:true},
    username2:{type:String,required:true},
    
    chats:[
     {u1:{type:String}
        
     },{
         u2:{type:String}
     }]
}
module.exports=mongoose.model('User',UserSchema);