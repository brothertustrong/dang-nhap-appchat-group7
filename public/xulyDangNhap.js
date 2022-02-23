//client truy cập domain phía server bằng socket.io
var socket = io("https://dang-nhap-appchat-group7.herokuapp.com");
// var socket = io("http://localhost:3000");

//client xử lý đăng nhập thất bại
socket.on("server-send-dang-nhap-that-bai", function(){
    $("#mainPage").hide();
    $("#left-web").show();
    $("#right-web").show();
    $("#formSignUp").hide();
    $("#thongBao").show();
});


// client xử lý đăng nhập thành công
socket.on("server-send-dang-nhap-thanh-cong", function(data){
    $("#userCurrent").html(data);
    $("#mainPage").show(500);
    $("#left-web").hide(1000);
    $("#right-web").hide(1000);
    $("#formSignUp").hide();
    $("#thongBao").hide();
});


// client cập nhật danh sách online
socket.on("server-send-danh-sach-usersOnline", function(data){
    $("#boxContent").html("");

    for (let index = 0; index < data.length; index++) {
        if(data[index].UsersOnline != ""){
            $("#boxContent").append("<div class='user'>" + data[index].UsersOnline + "</div>");
        }
    }
});


// client xử lý đăng ký thất bại
socket.on("server-send-dang-ki-that-bai", function(){
    $("#mainPage").hide();
    $("#left-web").hide();
    $("#right-web").hide();
    $("#formSignUp").show();
    $("#thongbaoSignUp").show();
});


// client xử lý đăng ký thành công
socket.on("server-send-dang-ky-thanh-cong", function(data){
    $("#mainPage").hide(1000);
    $("#formSignUp").hide(1000);
    $("#left-web").show(500);
    $("#right-web").show(500);
    $("#thongBao").hide();
    alert(data + " ơi bạn đăng ký tài khoản thành công rồi đấy :)");
});


// khi document ready
$(document).ready(function(){
    $("#mainPage").hide();
    $("#formSignUp").hide();
    $("#left-web").show();
    $("#right-web").show();
    $("#thongBao").hide();
    
    /* sự kiện nhấn nút đăng nhập */ 
    $("#btnDangNhap").click(function(){
        var strEmail = $("#txtEmail").val();
        var strPassword = $("#txtPassword").val();

        socket.emit("client-send-email-pw", {jsonEmail: strEmail, jsonPassword: strPassword});
    });


    // client xử lý sự kiện nhấn nút logout
    $("#btnLogout").click(function(){
        socket.emit("client-send-logout");
        $("#mainPage").hide(1000);
        $("#formSignUp").hide(1000);
        $("#left-web").show(500);
        $("#right-web").show(500);
        $("#thongBao").hide();
    });


    // client xử lý sự kiện nhấn nút tạo tài khoản
    $("#btnTaoTK").click(function(){
        $("#mainPage").hide(1000);
        $("#left-web").hide(1000);
        $("#right-web").hide(1000);
        $("#formSignUp").show(500);
        $("#thongbaoSignUp").hide();
    });    


    // client xử lý sự kiện nhấn nút signup
    $("#btnSignup").click(function(){
        var namedk = $("#firstname").val() + " " + $("#lastname").val();
        var emaildk = $("#txtEmSignup").val();
        var pwdk = $("#txtPwSignup").val();
        socket.emit("client-send-dang-ki-tai-khoan", {name: namedk, email: emaildk, password: pwdk});
    });    

});