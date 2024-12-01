$(document).ready(function () {
  var date = new Date();
  var month = date.getMonth() + 1;
  var year = date.getFullYear();

  //set up
  for (let i = 0; i <= 5; i++) {
    $("#row1").append(`<div class="row" id="row${i + 2}"></div>`);
    for (let j = 0; j < 7; j++) {
      $(`#row${i + 2}`).append(
        `<button type="button" class="day-cell col-1 " id="${i * 7 + j}"></button>`,
      );
    }
  }
  updateCalendar(month, year);
  $("#right").click(function () {
    if (month < 12) {
      month = month + 1;
    } else {
      year = year + 1;
      month = 1;
    }
    //console.log(month,year);
    updateCalendar(month, year);
  });
  $("#left").click(function () {
    if (month > 1) {
      month = month - 1;
    } else {
      year = year - 1;
      month = 12;
    }
    //console.log(month,year);
    updateCalendar(month, year);
  });
});

function updateCalendar(month, year) {
  const calendar = new Date(year, month, 0);
  const daysInMonth = calendar.getUTCDate() + 1;
  let frist_date = new Date(year, month - 1, 1);
  const offset = frist_date.getDay();
  $("#title").text(month + "," + year);

  for (let i = 0; i <= 6; i++) {
    for (let j = 0; j < 7; j++) {
      $(`#${i * 7 + j}`).text("");
    }
  }

  for (let i = 1; i <= daysInMonth; i++) {
    const newdate = new Date(Date.UTC(year, month, i));
    const pos = position(newdate, offset);
    $(`#${pos}`)
      .text(newdate.getDate())
      .hover(
        function () {
          $(this).css("background-color", "#f0fff0");
        },
        function () {
          $(this).css("background-color", "");
        },
      );
  }

  const jsonData = {
    month: month,
    year: year,
  };
  //console.log(jsonData);
  $.ajax({
    url: "/booking/match_coming",
    type: "POST",
    data: JSON.stringify(jsonData),
    contentType: "application/json",
    success: function (data) {
      //console.log(data);
    },
  })
    .done(function (response) {
      const result = response;
      if (result.status === "success") {
        const match_lst = JSON.parse(result.match_lst);
        console.log(match_lst);
        diaplay_matched(match_lst);
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
}

function position(date, offset) {
  return date.getDate() + offset - 1;
}

function diaplay_matched(match_lst) {
  match_lst.forEach((match) => {
    const date = new Date(match.date);
    var month = date.getMonth() + 1;
    var year = date.getFullYear();
    let frist_date = new Date(year, month - 1, 1);
    const offset = frist_date.getDay();
    const pos = position(date, offset);
    $(`#${pos}`)
      .append(match.match)
      .append(match.team_A, " vs ", match.team_B)
      .addClass("match")
      .attr("match-id", match._id)
      .click(function () {
        window.location.href = "/booking/match_detail?id=" + match._id;
      });
  });
}
