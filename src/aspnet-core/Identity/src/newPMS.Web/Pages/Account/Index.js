$(function () {
  //setTimeout(() => {
  //  var alert = $("#AbpPageAlerts").find(".alert").html();
  //  if (alert) {
  //    alert = alert.replace(
  //      /Invalid username or password/g,
  //      "Tên đăng nhập hoặc mật khẩu không đúng"
  //    );
  //    $("#AbpPageAlerts").find(".alert").html(alert);
  //  }
  //  //$("#AbpPageAlerts").show();
  //}, 111);
  setInterval(() => {
    $("#LoginInput_UserNameOrEmailAddress-error").text(
      "Vui lòng nhập tên đăng nhập"
    );
      $("#LoginInput_Password-error").text("Vui lòng nhập mật khẩu");
      $(".alert-dismissible").text("Tên đăng nhập hoặc mật khẩu không chính xác!")
      $("#AbpPageAlerts").css("opacity", "1");
      $("#AbpPageAlerts").css("right", "20px");
  });

  setTimeout(() => {
    var captchaVisible = $("#CaptchaCode").is(":visible");
    if (captchaVisible) {
      $("#CaptchaCode").val("");
    }
  }, 333);
  $("#reload-captcha").click(() => {
    d = new Date();
    $("#img-captcha").attr("src", "/account/captchaimage?" + d.getTime());
  });
});
