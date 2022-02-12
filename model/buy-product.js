const mongoose = require('mongoose')

var orders_placed =new mongoose.Schema({
    message: {type: String, required:true},
    amount_nos: [],
    status: {type:String, enum:['Initiated', 'In Progress', 'Delevered', 'Cancel'], default: 'Initiated' },
    time_of_creation: {type: Date, default: Date.now},
    user: [{type:mongoose.Schema.Types.ObjectId, ref:'User_Ids'}],
    product: [{type:mongoose.Schema.Types.ObjectId, ref:'product'}]
});

var orders_placed_Model = mongoose.model('order', orders_placed);
module.exports=orders_placed_Model;