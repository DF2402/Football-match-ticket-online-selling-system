$(document).ready(function () {
  $("#change").toggle();
  var username = "";
  $("#logout").click(function () {
    if (confirm("comfirm to logout?")) {
      $.ajax({
        url: "/auth/logout",
        type: "post",
      })
        .done(function () {
          window.open("/login.html", "_self");
        })
        .fail(function () {
          alert("error");
        });
    }
  });

  $("#update").on("click", function () {
    event.preventDefault();
    const nickname = $("#nickname_input").val();
    const email = $("#email_input").val();
    const password = $("#password_input").val();
    const repeat_password = $("#repeat_password_input").val();
    const jsondata = {};
    if (email) {
      jsondata["email"] = email;
    }
    if (nickname) {
      jsondata["nickname"] = nickname;
    }
    if (repeat_password != password || password != "") {
      alert("password not correct");
    } else if (password == "" || repeat_password == "") {
    } else {
      jsondata["password"] = password;
    }

    $.ajax({
      url: "/auth/get_me",
      type: "POST",
      data: JSON.stringify(jsondata),
      contentType: "application/json",
    })
      .done(function (response) {
        const result = response;
        if (result.status === "success") {
          user = result.user;
          display_user(user);
          console.log(result.user.username);
          window.location.href = "/profile";
        }
      })
      .fail(function (response) {
        let errorResponse;
        errorResponse = JSON.parse(response.responseText);
        if (errorResponse.status === "failed") {
          alert(errorResponse.message);
        } else {
          alert("Unknown error");
        }
      });
  });

  $.ajax({
    url: "/auth/get_me",
    type: "GET",
  })
    .done(function (response) {
      const result = response;
      if (result.status === "success") {
        user = result.user;
        display_user(user);
        console.log(result.user.username);
      }
    })
    .fail(function (response) {
      let errorResponse;
      errorResponse = JSON.parse(response.responseText);
      if (errorResponse.status === "failed") {
        alert(errorResponse.message);
      } else {
        alert("Unknown error");
      }
    });
  $("#change_p_info").on("click", function () {
    $("#change").toggle();
    $(".display").toggle();
  });
});

function display_user(user) {
  $("#nickname").append(user.nickname);
  $("#username").append(user.username);
  $("#brithday").append(user.brithday);
  $("#email").append(user.email);
  $("#gender").append(user.gender);
}
