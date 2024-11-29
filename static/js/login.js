function validateForm() {
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  let username_Str = username.trim();
  if (username == '') {
    alert('Username and password cannot be empty');
    return false;
  }

  let password_Str = password.trim();
  if (username == '') {
    alert('Username and password cannot be empty');
    return false;
  }

  return true;
}

$(document).ready(function () {
  $('#login').click(function () {
    event.preventDefault();
    console.log('click');
    if (!validateForm()) {
      return;
    }

    const formData = new FormData();
    formData.append('username', $('#username').val());
    formData.append('password', $('#password').val());

    $.ajax({
      url: '/auth/login',
      type: 'POST',
      data: formData,
      processData: false,
      contentType: false,
    })
      .done(function (response) {
        const result = response;
        if (result.status === 'success') {
          alert(`logged as ${result.user.username}`);
          $(location).attr('href', '/index.html');
        }
      })
      .fail(function (response) {
        let errorResponse;
        errorResponse = JSON.parse(response.responseText);
        if (errorResponse.status === 'failed') {
          alert(errorResponse.message);
        } else {
          alert('Unknown error');
        }
      });
  });
});
