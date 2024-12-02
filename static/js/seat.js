$(document).ready(function () {
  const queryString = window.location.search;
  const params = queryString.split("&");
  const venue = decodeURIComponent(params[0].split("=")[1]);
  const id = decodeURIComponent(params[1].split("=")[1]);
  //console.log(venue);
  $.ajax({
    url: "/seat_map/venue",
    type: "POST",
    data: JSON.stringify({ venue: venue }),
    contentType: "application/json",
    success: function (data) {
      //console.log(data);
    },
  })
    .done(function (response) {
      const result = response;
      if (result.status === "success") {
        //console.log(result);
        const venue = JSON.parse(result.venue);
        display_stands(venue);
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

function display_stands(venue) {
  const queryString = window.location.search;
  const params = queryString.split("&");
  const id = decodeURIComponent(params[1].split("=")[1]);

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
        $(".col").addClass("text-center pt-4").css("height", "40px");
        $("#teams")
          .text(`${match.team_A} vs ${match.team_B}`)
          .css("font-size", "40px");
        $("#date").text(match.date).css("font-size", "20px");
        $("#time").text(match.time).css("font-size", "20px");
        $("#venue").text(match.venue).css("font-size", "20px");
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

  const stand_lst = venue.stands;
  var stands = $(document.createElementNS("http://www.w3.org/2000/svg", "svg"));
  stands.attr("id", "stands").attr("width", "1200px").attr("height", `400px`);
  var count = 0;
  var cur_stand;
  var selected = [];

  get_sold_seats(id).then((soldMap) => {
    console.log(soldMap["B"]);
    stand_lst.forEach((stand) => {
      const name = stand.stand;
      const m = stand.m;
      const n = stand.n;
      const sold = soldMap[`${name}`] || [];
      console.log(sold);
      let ratio = sold.length / (m * n);
      console.log(ratio);
      var svg = $(
        document.createElementNS("http://www.w3.org/2000/svg", "svg"),
      );
      svg
        .attr("x", `${count * 200}`)
        .attr("width", "180px")
        .attr("height", `380px`)
        .attr("style", "border: 1px solid black")
        .attr("name", `${name}`);

      var rect = $(
        document.createElementNS("http://www.w3.org/2000/svg", "rect"),
      );
      rect
        .attr("x", "0px")
        .attr("y", `0px`)
        .attr("width", "200px")
        .attr("height", `400px`)
        .css({
          fill: `${getBgColor(ratio)}`,
        })
        .on("click", function () {
          //console.log(`${name}`);
          $("#stands").toggle();
          cur_stand = stand;
          display_seat(stand, stand_lst);
        });

      svg.append(rect);

      var text = $(
        document.createElementNS("http://www.w3.org/2000/svg", "text"),
      );
      text
        .append("text")
        .attr("x", "20px")
        .attr("y", `200px`)
        .attr("font-size", "32px")
        .text(`${name} ${(ratio * 100).toFixed(2)}%`);
      svg.append(text);
      stands.append(svg);
      count++;

      //bulid seat map
      var seat_svg = $(
        document.createElementNS("http://www.w3.org/2000/svg", "svg"),
      );

      seat_svg
        .attr("width", `${m * 50 + 30}`)
        .attr("height", `${n * 50 + 80}px`)
        .attr("style", "border: 1px solid black")
        .attr("id", `Seat_${name}`)
        .attr("class", "Seat_map");

      var text = $(
        document.createElementNS("http://www.w3.org/2000/svg", "text"),
      );
      text
        .append("text")
        .attr("x", `${30}px`)
        .attr("y", `${n * 50 + 40}px`)
        .attr("font-size", "24px")
        .text(`Stand ${name}`);
      seat_svg.append(text);

      for (var i = 0; i < n; i++) {
        for (var j = 0; j < m; j++) {
          var rect = $(
            document.createElementNS("http://www.w3.org/2000/svg", "rect"),
          );
          rect
            .attr("x", `${j * 50 + 20}px`)
            .attr("y", `${i * 50 + 10}px`)
            .attr("width", "40px")
            .attr("height", "40px")
            .attr("id", `${name} ${i * m + j + 1}`)
            .attr("class", "seat");
          if (sold.includes(i * m + j + 1)) {
            rect.removeClass("seat").addClass("sold");
          }
          var text = $(
            document.createElementNS("http://www.w3.org/2000/svg", "text"),
          );
          text
            .attr("x", `${j * 50 + 22}px`)
            .attr("y", `${i * 50 + 22}px`)
            .attr("font-size", "12px")
            .attr("fill", "white")
            .text(`${name} ${i * m + j + 1}`);
          seat_svg.append(rect);
          seat_svg.append(text);
          $("#svg_col").append(seat_svg);
        }
      }
      $(`#Seat_${name}`).toggle();
    });

    $(".seat").on("click", function () {
      var id = $(this).attr("id");
      console.log(id);
      if (selected.indexOf(id) === -1) {
        selected.push(id);
        $(this).addClass("selected");
      } else {
        selected.splice(selected.indexOf(id), 1);
        $(this).removeClass("selected");
      }
      console.log(selected);
    });
  });

  $("#svg_col").append(stands);

  var left_button = $(
    '<button type="button" class="btn col-1 mx-10" id="left_button"> &lt; </button>',
  );
  var right_button = $(
    '<button type="button" class="btn col-1 mx-10" id="right_button"> &gt; </button>',
  );
  $("#left_button").append(left_button).toggle();
  $("#right_button").append(right_button).toggle();

  $("#left_button").on("click", function () {
    var index = stand_lst.indexOf(cur_stand);
    //sconsole.log(index);
    if (index > 0) {
      $(`#Seat_${stand_lst[index].stand}`).toggle();
      index--;
      cur_stand = stand_lst[index];
    } else {
      $(`#Seat_${stand_lst[index].stand}`).toggle();
      index = stand_lst.length - 1;
      cur_stand = stand_lst[index];
    }
    $(`#Seat_${stand_lst[index].stand}`).toggle();
  });

  $("#right_button").on("click", function () {
    var index = stand_lst.indexOf(cur_stand);
    //console.log(index);
    if (index < stand_lst.length - 1) {
      $(`#Seat_${stand_lst[index].stand}`).toggle();
      index++;
      cur_stand = stand_lst[index];
    } else {
      $(`#Seat_${stand_lst[index].stand}`).toggle();
      index = 0;
      cur_stand = stand_lst[index];
    }
    $(`#Seat_${stand_lst[index].stand}`).toggle();
  });

  var back_button = $(
    '<button type="button" class="btn btn-primary align-text-bottom" id="back"> Back </button>',
  );
  var book_button = $(
    '<button type="button" class="btn btn-primary   align-text-bottom" id="book"> Pay </button>',
  );
  $(".col").addClass("text-center py-2 my-2").css("height", "40px");
  $("#back_col").append(back_button);
  $("#book_col").append(book_button);
  $("#back").toggle();
  $("#book").toggle();

  $("#back").on("click", function () {
    $("#left_button").toggle();
    $("#right_button").toggle();
    $(`#Seat_${cur_stand.stand}`).toggle();
    $("#back").toggle();
    $("#book").toggle();

    $("#stands").toggle();
  });

  $("#book").on("click", function () {
    window.location.href = `/booking/pay?id=${id}&selected=${selected}`;
  });
}
function getBgColor(ratio) {
  if (ratio > 0.5) return "#ff8080";
  else return "#80ff80";
}

function display_seat(stand) {
  $("#left_button").toggle();
  $("#right_button").toggle();
  $(`#Seat_${stand.stand}`).toggle();
  $("#back").toggle();
  $("#book").toggle();
}

function get_sold_seats(match_id) {
  return $.ajax({
    url: "/booking/get_transactions",
    type: "POST",
    data: JSON.stringify({ match_id }),
    contentType: "application/json",
  })
    .then((response) => {
      const result = response;
      var seat_map = {};
      if (result.status === "success") {
        const seat_lst = result.seat_lst;
        seat_lst.forEach((seat) => {
          const parts = seat.split(" ");
          const stand = parts[0];
          const seatNo = parseInt(parts[1]);
          if (!seat_map[stand]) {
            seat_map[stand] = [];
          }
          seat_map[stand].push(seatNo);
        });
        console.log(seat_map);
        return seat_map;
      } else {
        return []; // 或者其他处理方式
      }
    })
    .catch((err) => {
      console.error(err);
      return false;
    });
}
