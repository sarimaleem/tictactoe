var app = require("express")();
const express = require("express");
var http = require("http").Server(app);
var io = require("socket.io")(http);
var port = process.env.PORT || 3000;
const bodyParser = require("body-parser");
const url = require("url");

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
let rooms = 0;
let roominfo = {};

io.on("connection", function (socket) {
  socket.on("move", function (data) {

    if(roominfo[data.room]['turn'] === data.playerToken) { 
      data["turn"] = roominfo[data.room]["turn"];
      io.in(data.room).emit("move", data);

      if (roominfo[data.room]["turn"] === "X") {
        roominfo[data.room]["turn"] = "O";
      } else {
        roominfo[data.room]["turn"] = "X";
      }
    }

  });

  socket.on('win', (data) => {
    io.in(data.room).emit('win', data)
  })

  socket.on("joinRoom", (room) => {
    socket.join(room);
    io.in(room).emit("joinRoom", roominfo[room]);
    console.log(socket.id);
  });
});

app.post("/create", (req, res) => {
  roominfo[rooms] = { gameReady: false, turn: "X", numPlayers: 1 };
  res.redirect(
    url.format({
      pathname: "/game.html",
      query: {
        room: rooms,
        name: req.body.name,
        playerToken: 'X',
      },
    })
  );

  rooms++;
});

app.post("/join", (req, res) => {
  let room = req.body.room;

  if (roominfo[room] !== undefined && roominfo[room]["numPlayers"] === 1) {
    roominfo[room]["numPlayers"] = 2;
    roominfo[room]["gameReady"] = true;
    res.redirect(
      url.format({
        pathname: "/game.html",
        query: {
          room: room,
          name: req.body.name,
          playerToken: 'O',
        },
      })
    );
  } else {
    res.redirect("index.html");
  }
});

http.listen(port, function () {
  console.log("listening on *:" + port);
});
