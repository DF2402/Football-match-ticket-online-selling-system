function validateForm() {
  const cardNo = $("#cardNo").val();
  const name = $("#name").val();
  const expriydate = $("#expriydate").val();
  const cvv = $("#cvv").val();

  if (!name) {
    alert("Name cannot be empty");
    return false;
  }

  if (!cardNo) {
    alert("crad number cannot be empty");
    return false;
  }

  if (!expriydate) {
    alert("expriy date cannot be empty");
    return false;
  }

  if (!cvv) {
    alert("Security cannot be empty");
    return false;
  }

  return true;
}

function ticket_generate(id, selected) {
  var fee_sum = 0;
  return $.ajax({
    url: "/booking/match",
    type: "POST",
    data: JSON.stringify({ id: id }),
    contentType: "application/json",
  })
    .then((response) => {
      const result = response;
      if (result.status === "success") {
        const match = JSON.parse(result.match);

        var tickets = [];
        selected.forEach((seat) => {
          stand = seat.charAt(0);
          const seat_class = match.stand[`${stand}`];
          const fee = match.fee[`${seat_class}`];
          console.log(match.fee[`${seat_class}`]);
          fee_sum = fee_sum + fee;

          tickets.push({
            seat_class: seat_class,
            fee: fee,
            seat: seat,
          });
        });
        $("#fee").text(`$ ${fee_sum}`);
        return tickets;
      }
    })
    .catch((err) => {
      console.error(err);
      process.exit(1);
      return false;
    });
}
$(document).ready(function () {
  const queryString = window.location.search;
  const params = queryString.split("&");

  const id = params[0].split("=")[1];

  const selected = decodeURIComponent(params[1].split("=")[1])
    .replace(/"/g, "")
    .split(",");

  $.ajax({
    url: "/booking/match",
    type: "POST",
    data: JSON.stringify({ id: id }),
    contentType: "application/json",
  })
    .done(function (response) {
      const result = response;
      if (result.status === "success") {
        const match = JSON.parse(result.match);
        $(".col").addClass("pt-4").css("height", "40px");
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

  var ticket = [];
  ticket_generate(id, selected).then((tickets) => {
    ticket = tickets;
    console.log(ticket);
  });
  var username = "";
  $.ajax({
    url: "/auth/me",
    type: "GET",
    success: function (data) {
      //console.log(data);
    },
  })
    .done(function (response) {
      const result = response;
      if (result.status === "success") {
        username = result.username;
        console.log(result.username);
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

  $("#pay").click(function () {
    event.preventDefault();
    //console.log("click");
    if (!validateForm()) {
      return;
    }

    const cardNo = $("#cardNo").val();
    const name = $("#name").val();
    const expriydate = $("#expriydate").val();
    const cvv = $("#cvv").val();

    //console.log(cardNo, name, expriydate, cvv);

    const credit_card = {
      cardNo: cardNo,
      name: name,
      expriydate: expriydate,
      cvv: cvv,
    };

    data = {
      username: username,
      match_id: id,
      credit_card: credit_card,
      ticket: ticket,
    };
    console.log(JSON.stringify(data));
    $.ajax({
      url: "/booking/pay",
      method: "POST",
      data: JSON.stringify(data),
      contentType: "application/json",
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
