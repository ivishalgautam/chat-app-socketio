var socket = io();

const output = document.getElementById("output");
const typing = document.getElementById("typing");

var nickname = document.getElementById("nickname");
const message = document.getElementById("message");

const btn = document.getElementById("btn");

do {
  nickname = prompt("Enter your name to join the chat.");
} while (!nickname);

btn.addEventListener("click", function () {
  console.log("object");
  socket.emit("chat message", {
    nickname: nickname,
    message: message.value,
  });
});

// set chat message to the dom from the server
socket.on("chat message", (data) => {
  typing.innerHTML = "";
  output.innerHTML += `<p><strong>${data.nickname}</strong>: ${data.message}</p>`;
  window.scrollTo(0, document.body.scrollHeight);
});

// receive chats from server
socket.on("receive chat", (data) => {
  if (data.length) {
    data.forEach((element) => {
      // console.log(data);
      typing.innerHTML = "";
      output.innerHTML += `<p><strong>${element.name}</strong>: ${element.msg}</p>`;
      window.scrollTo(0, document.body.scrollHeight);
    });
  }
});

// typing...
message.addEventListener("keypress", () => {
  socket.emit("typing", nickname);
});

socket.on("typing", (data) => {
  typing.innerHTML = `<p id="para"><em>${data}</em> is typing...</p>`;
  window.scrollTo(0, document.body.scrollHeight);
});
