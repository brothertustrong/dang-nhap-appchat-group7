var ListUsers = require("./ListUsers");
var express = require('express');
const res = require("express/lib/response");
var app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.set("views", "./views");

var server = require("http").Server(app);
var io = require("socket.io")(server);
// server.listen(3000);

server.listen(process.env.PORT || 3000);


io.on("connection", function(socket){
    console.log("co nguoi ket noi len server " + socket.id);

    /* server sự kiện nhấn nút đăng nhập */ 
    socket.on("client-send-email-pw", function(data){

        ListUsers.find({Email : data.jsonEmail , Password : data.jsonPassword}, (err, docs)=>{
            console.log("đây là mảng sau khi lọc email password");
            console.log(docs);
            if(docs.length){
                console.log("đăng nhập thành công");
                socket.Email = docs[0].Email;
                socket.Password = docs[0].Password;
                socket.user = docs[0].User;
                socket.emit("server-send-dang-nhap-thanh-cong", socket.user);
                ListUsers.updateOne({Email : data.jsonEmail , Password : data.jsonPassword}, {Email : data.jsonEmail , Password : data.jsonPassword , User : socket.user , UsersOnline : socket.user}, (err, res)=>{
                    if(err) throw err;

                    console.log("cập nhật danh sách online thành công...");
                    ListUsers.find({}, (err, docs)=>{
                        console.log("đây là toàn bộ mảng sau khi cập nhật danh sách online");
                        console.log(docs);
                        io.sockets.emit("server-send-danh-sach-usersOnline", docs);
                    });
                });
            }else{
                socket.emit("server-send-dang-nhap-that-bai");
            }
        });
    });

    /*server xử lý bấm loggout*/
    socket.on("client-send-logout", function(){
        ListUsers.updateOne({Email : socket.Email , Password : socket.Password}, {Email : socket.Email , Password : socket.Password , User : socket.user , UsersOnline : ""}, (err, res)=>{
            if(err) throw err;

            console.log("cập nhật danh sách online thành công...");
            ListUsers.find({}, (err, docs)=>{
                console.log("đây là toàn bộ mảng sau khi cập nhật danh sách online");
                console.log(docs);
                socket.broadcast.emit("server-send-danh-sach-usersOnline", docs);
            });
        });
    });

    /* server xử lý sự kiện ngắt kết nối */
    socket.on("disconnect", function(){
        console.log(socket.user + " ngắt kết nối!");
        ListUsers.updateOne({Email : socket.Email , Password : socket.Password}, {Email : socket.Email , Password : socket.Password , User : socket.user , UsersOnline : ""}, (err, res)=>{
            if(err) throw err;

            console.log("cập nhật danh sách online thành công...");
            ListUsers.find({}, (err, docs)=>{
                console.log("đây là toàn bộ mảng sau khi cập nhật danh sách online");
                console.log(docs);
                socket.broadcast.emit("server-send-danh-sach-usersOnline", docs);
            });
        });
    });

    /*server xử lý đăng ký tài khoản*/
    socket.on("client-send-dang-ki-tai-khoan", function(data){
        
        ListUsers.find({Email : data.email}, (err, docs)=>{
            console.log("đây là mảng sau khi lọc đktk");
            console.log(docs);
            if(docs.length){
                console.log("đk thất bại");
                socket.emit("server-send-dang-ki-that-bai");
            }else{
                console.log("đk thành công");
                const lu = new ListUsers({Email : data.email , Password : data.password, User : data.name, UsersOnline : ""});
                lu.save().then(()=>{console.log("thêm user thành công..."); ListUsers.find({}, (err, docs)=>{
                    console.log(docs);
                });}).catch((err)=>{throw err});
                socket.emit("server-send-dang-ky-thanh-cong", data.name);
            }
        });
    });
});

app.get("/", function(req, res){
    res.render("viewDangNhap");
    // const lu = new ListUsers({Email : "B" , Password : "B", User : "B", UsersOnline : "B"});
    // lu.save().then(()=>{console.log("thêm dữ liệu thành công..."); ListUsers.find({}, (err, docs)=>{
    //     console.log(docs);
    // });}).catch((err)=>{throw err});

    // ListUsers.deleteMany({ }, (err)=>{
    //     if(err) throw err;
    //     console.log("xoá toàn bộ bảng thành công !!!");
    // });

    // ListUsers.updateOne({Email : "B" , Password : "B"}, {UsersOnline : ""}, (err, res)=>{
    //     if(err) throw err;

    //     console.log("cập nhật thành công...");
    //     ListUsers.find({}, (err, docs)=>{
    //         console.log("đây là toàn bộ mảng");
    //         console.log(docs);
    //     });
    // });

    // ListUsers.find({}, (err, docs)=>{
    //     console.log("đây là toàn bộ mảng");
    //     console.log(docs);
    // });

    // hàm find nếu có thuôc tính đưa vào thì chỉ trả lại đối tượng có thuộc tính phù hợp
    // ListUsers.find({Email : "C" , Password : "C"}, (err, docs)=>{
    //     console.log(docs);
    //});
});