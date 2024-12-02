$(document).ready(function () {
  $("#matchForm").toggle();
  $("#view").toggle();
  $("#addMatch").on("click", function () {
    $("#matchForm").toggle();
  });

  $("#add").on("click", function () {
    event.preventDefault();
    const matchData = {
      match: $("#match").val(),
      team_A: $("#teamA").val(),
      team_B: $("#teamB").val(),
      date: $("#date").val(),
      time: $("#time").val(),
      venue: $("#venue").val(),
    };
    console.log(matchData);
    $.ajax({
      url: "/booking/add_match",
      type: "POST",
      data: JSON.stringify(matchData),
      contentType: "application/json",
    })
      .done(function (response) {
        const result = response;
        if (result.status === "success") {
          alert("match added ");
        }
      })

      .fail(function (response) {
        var errorResponse = JSON.parse(response.responseText);
        if (errorResponse.status === "failed") {
          alert(errorResponse.message);
        } else {
          alert("Unknown error");
        }
      });
  });

  $("#viewMatch").on("click", function () {
    $("#view").empty();
    $("#view").toggle();
    $.ajax({
      url: "/booking/get_all_matches",
      type: "POST",
    })
      .done(function (response) {
        const result = response;
        if (result.status === "success") {
          const match_lst = JSON.parse(result.match_lst);
          match_lst.forEach((match) => {
            $("#view").append(`<tr> 
                                            <td>${match.date} ${match.time}</td>
                                            <td>${match.match} - ${match.team_A} vs ${match.team_B}</td>
                                            
                                        </tr>`);
          });
        }
      })
      .fail(function (response) {
        var errorResponse = JSON.parse(response.responseText);
        if (errorResponse.status === "failed") {
          alert(errorResponse.message);
        } else {
          alert("Unknown error");
        }
      });
  });
  $("#viewVenue").on("click", function () {
    $("#view").empty();
    $("#view").toggle();
    $.ajax({
      url: "/seat_map/fetch_all_venue",
      type: "POST",
    })
      .done(function (response) {
        const result = response;
        if (result.status === "success") {
          const venue_lst = JSON.parse(result.venue_lst);
          venue_lst.forEach((venue) => {
            $("#view").append(`<tr> 
                                            <td>${venue.venue} </td>
                                            
                                        </tr>`);
          });
        }
      })
      .fail(function (response) {
        var errorResponse = JSON.parse(response.responseText);
        if (errorResponse.status === "failed") {
          alert(errorResponse.message);
        } else {
          alert("Unknown error");
        }
      });
  });
});
