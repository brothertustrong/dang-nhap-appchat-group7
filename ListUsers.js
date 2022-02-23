const mongoose = require("mongoose");

//kết nối
const url = "mongodb+srv://TaAnhTu:Bai8Customer@cluster0.bili4.mongodb.net/bai8?retryWrites=true&w=majority";

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(()=> {
    console.log('Database connected');
  })
  .catch((error)=> {
    console.log('Error connecting to database');
  });

//thiết lập cấu trúc bảng (kiểu của bảng)
const Schema = mongoose.Schema;// schema là đại điện cho bảng
const ObjectId = Schema.ObjectId;// id tự tạo
//tên kiểu bảng (giống tên kiểu dữ liệu câu trúc), định nghĩa cột trong bảng (các thuộc tính của json), các kiểu giá trị , value mặc định
const ListUsersSchema = new Schema({
    Email : {type: String},
    Password : {type: String},
    User : {type: String},
    UsersOnline : {type: String}
});

//tạo bảng (giống tên biến cấu trúc) dựa trên cấu trúc-kiểu bảng (giống kiểu dữ liệu cấu trúc).
//export ra module để sử dụng lại cho server
module.exports = mongoose.model('ListUsers', ListUsersSchema);