$(document).ready(function () {
  const queryString = window.location.search;
  const params = queryString.split("&");
  const venue = decodeURIComponent(params[0].split("=")[1]);
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
        console.log(result);
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
  const stand_lst = venue.stands;
  var stands = $(document.createElementNS("http://www.w3.org/2000/svg", "svg"));
  stands.attr("id", "stands").attr("width", "1200px").attr("height", `1400px`);
  var count = 0;
  var cur_stand;
  stand_lst.forEach((stand) => {
    const name = stand.stand;
    const m = stand.m;
    const n = stand.n;
    const sold = stand.sold;
    let ratio = sold.length / (stand.m * stand.n);
    var svg = $(document.createElementNS("http://www.w3.org/2000/svg", "svg"));
    svg
      .attr("x", `${count * 200}`)
      .attr("width", "180px")
      .attr("height", `380px`)
      .attr("style", "border: 1px solid black;")
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
      .attr("x", "50px")
      .attr("y", `200px`)
      .attr("font-size", "32px")
      .text(`${name} ${ratio.toFixed(2) * 100}%`);
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
      .attr("style", "border: 1px solid black;")
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

    var selected = [];

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
    '<button type="button" class="btn col-1 mx-10" id="left"> &lt; </button>',
  );
  var right_button = $(
    '<button type="button" class="btn col-1 mx-10" id="right"> &gt; </button>',
  );
  $("#left").append(left_button).toggle();
  $("#right").append(right_button).toggle();

  $("#left").on("click", function () {
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

  $("#right").on("click", function () {
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
  $("#back_col").append(back_button).toggle();
  $("#book_col").append(book_button).toggle();

  $("#back").on("click", function () {
    $("#left").toggle();
    $("#right").toggle();
    $(`#Seat_${cur_stand.stand}`).toggle();
    $("#back_col").toggle();
    $("#book_col").toggle();

    $("#stands").toggle();
  });
}

function getBgColor(ratio) {
  if (ratio > 0.5) return "#ff8080";
  else return "#80ff80";
}

function display_seat(stand) {
  $("#left").toggle();
  $("#right").toggle();
  $(`#Seat_${stand.stand}`).toggle();
  $("#back_col").toggle();
  $("#book_col").toggle();
  //console.log( stands.length);
}
