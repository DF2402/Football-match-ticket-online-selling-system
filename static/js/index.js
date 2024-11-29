$(document).ready(function () {
  const username = sessionStorage.getItem('username');
  const role = sessionStorage.getItem('role');
  $('#greeting').text(`Welcome back! ${username} (${role})`);
  $.ajax({
    url: '/auth/me',
    type: 'GET',
  })
    .done(function (response) {})
    .fail(function (response) {
      alert('Please login');
      window.open('/login.html', '_self');
    });

  $('#logout').click(function () {
    if (confirm('comfirm to logout?')) {
      $.ajax({
        url: '/auth/logout',
        type: 'post',
      })
        .done(function () {
          window.open('/login.html', '_self');
        })
        .fail(function () {
          alert('error');
        });
    }
  });
});
