$(document).ready(function () {
  const queryString = window.location.search;
  const params = queryString.split("&");
  const id = params[0].split("=")[1];
  console.log(id);

  $.ajax({
    url: "/booking/match",
    type: "POST",
    data: JSON.stringify({ id: id }),
    contentType: "application/json",
    success: function (data) {
      //console.log(data);
    },
  })
    .done(function (response) {
      const result = response;
      if (result.status === "success") {
        const match = JSON.parse(result.match);
        console.log(match.venue);
        diaplay_detail(match);
        $("#book").click(function () {
          window.location.href = "/seat_map/seat?venue=" + match.venue;
        });
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

function diaplay_detail(match) {
  $(".col").addClass("text-center pt-4").css("height", "40px");
  $("#match").text(match.match).css("font-size", "40px");
  $("#teams")
    .text(`${match.team_A} vs ${match.team_B}`)
    .css("font-size", "40px");
  $("#date").text(match.date).css("font-size", "20px");
  $("#time").text(match.time).css("font-size", "20px");
  $("#venue").text(match.venue).css("font-size", "20px");
}
