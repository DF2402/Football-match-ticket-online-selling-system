function validateForm() {
  const cardNo = document.getElementById("cardNo").value;
  const name = document.getElementById("name").value;

  let username_Str = name.trim();
  if (name == "") {
    alert("Name cannot be empty");
    return false;
  }

  let cradNo_Str = cardNo.trim();
  if (cradNo_Str == "") {
    alert("cradNo_Str cannot be empty");
    return false;
  }

  return true;
}

$(document).ready(function () {
  $("#pay").click(function () {
    $.ajax({
      url: "#",
      method: "POST",
      data: formData,
      processData: false,
      contentType: false,
    })
      .done(function (response) {
        const result = response;
        if (response.status === "success") {
          alert(`Your payment is success!`);
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
