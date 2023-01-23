/** @format */

const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const userRoutes = require("./routes/userRoutes");
const messageRoute = require("./routes/messagesRoute");
const socket = require("socket.io");

dotenv.config();
app.use(cors());
app.use(express.json());

app.use("/api/auth", userRoutes);
app.use("/api/message", messageRoute);

//mongoose connection
mongoose
	.connect(process.env.MONGO_URL, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => {
		console.log("DB Connection Successful!");
	})
	.catch((err) => console.log(err));

const server = app.listen(process.env.PORT, () => {
	console.log(`Server started on Port ${process.env.PORT}`);
});

const io = socket(server, {
	cors: {
		origin: "http://localhost:3000",
		credentials: true,
	},
});
//store all online users inside this map
global.onlineUsers = new Map();

io.on("connection", (socket) => {
	global.chatSocket = socket;
	console.log("ws connected");
	socket.on("add-user", (userId) => {
		onlineUsers.set(userId, socket.id);
		console.log("returns the user Id : " + userId);
	});

	// socket for group chat
	// socket.on("join chat", (room) => {
	// 	socket.join(room);
	// 	console.log("user joined the room" + room);
	// });

	socket.on("send-msg", (data) => {
		const sendUserSocket = onlineUsers.get(data.to);
		if (sendUserSocket) {
			socket.to(sendUserSocket).emit("msg-recieved", data.message);
		}
		//console.log("msg rec :" + JSON.stringify(data));
	});
});
