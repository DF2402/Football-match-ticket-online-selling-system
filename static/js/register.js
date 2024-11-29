$(document).ready(function () {
  $("#register").on("click", function (event) {
    const username = $("#username").val();
    const nickname = $("#nickname").val();
    const email = $("#email").val();
    const gender = $("#gender").val();
    const birthday = $("#birthday").val();
    const password = $("#password").val();
    const repeat_password = $("#repeat_password").val();

    if (!username || !nickname || !email || !birthday || !password) {
      alert("The form is not complete");
      return;
    }

    if (password != repeat_password) {
      alert("Password mismatch!");
      return;
    }

    if (gender == null) {
      alert("Please select your gender");
      return;
    }
    var formData = new FormData();
    formData.append("username", username);
    formData.append("nickname", nickname);
    formData.append("email", email);
    formData.append("gender", gender);
    formData.append("birthday", birthday);
    formData.append("password", password);

    $.ajax({
      url: "/auth/register",
      method: "POST",
      data: formData,
      processData: false,
      contentType: false,
    })
      .done(function (response) {
        const result = response;
        if (response.status === "success") {
          alert(
            `Welcome, ${username}! \n You can login with your account now!`,
          );
          $(location).attr("href", "/matches.html");
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
});
