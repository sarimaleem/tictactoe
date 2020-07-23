var app = require("express")();
const express = require("express");
var http = require("http").Server(app);
var io = require("socket.io")(http);
var port = process.env.PORT || 3000;
const bodyParser = require("body-parser");
const url = require("url");

app.use(express.static("forms", { index: "create.html" }));
app.use(express.static("multiplayer"));
app.use(express.static('computer'))

app.use(bodyParser.urlencoded({ extended: true }));
let roominfo = {};

io.on("connection", function (socket) {
  socket.on("move", function (data) {
    if (roominfo[data.room]["turn"] === data.playerToken) {
      data["turn"] = roominfo[data.room]["turn"];
      io.in(data.room).emit("move", data);
      if (roominfo[data.room]["turn"] === "X") {
        roominfo[data.room]["turn"] = "O";
      } else {
        roominfo[data.room]["turn"] = "X";
      }
    }
  });

  socket.on("win", (data) => {
    io.in(data.room).emit("win", data);
  });

  socket.on("joinRoom", (room) => {
    socket.join(room);
    io.in(room).emit("joinRoom", roominfo[room]);
    console.log(socket.id);
  });
});

app.post("/create", (req, res) => {

  if(req.body.type === 'AI') { 
    res.redirect(
      url.format({
        pathname: '/botgame.html',
        query: {
          name: req.body.name,
          difficulty: req.body.difficulty
        }
      })
    )
    return;
  }
  let code = genAlphaNumeric();
  roominfo[code] = { gameReady: false, turn: "X", numPlayers: 1 };
  res.redirect(
    url.format({
      pathname: "/game.html",
      query: {
        room: code,
        name: req.body.name,
        playerToken: "X",
      },
    })
  );
});

app.post("/join", (req, res) => {
  let room = req.body.room;
  console.log(roominfo);
  if (roominfo[room] !== undefined && roominfo[room]["numPlayers"] === 1) {
    roominfo[room]["numPlayers"] = 2;
    roominfo[room]["gameReady"] = true;
    res.redirect(
      url.format({
        pathname: "/game.html",
        query: {
          room: room,
          name: req.body.name,
          playerToken: "O",
        },
      })
    );
  } else {
    res.redirect("join.html");
  }
});

http.listen(port, function () {
  console.log("listening on *:" + port);
});

function genAlphaNumeric() {
  var result = "";
  chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  for (var i = 0; i < 5; i++)
    result += chars[Math.floor(Math.random() * chars.length)];
  return result;
}
