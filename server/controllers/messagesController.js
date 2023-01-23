/** @format */

const messageModel = require("../models/messageModel");
const Chat = require("../models/chatModel");
module.exports.addMessage = async (req, res, next) => {
	try {
		const { from, to, message } = req.body;
		const data = await messageModel.create({
			message: {
				text: message,
			},
			users: [from, to],
			sender: from,
		});

		if (data)
			return res.json({
				msg: "Message added successfully!",
			});
		return res.json({
			msg: "Failed to add message to DB",
		});
	} catch (err) {
		next(err);
	}
};
module.exports.getAllMessage = async (req, res, next) => {
	try {
		const { from, to } = req.body;
		const messages = await messageModel
			.find({
				users: {
					$all: [from, to],
				},
			})
			.sort({ updatedAt: 1 });
		// console.log("all the message :" + messages);

		const projectMessages = messages.map((msg) => {
			return {
				fromSelf: msg.sender.toString() === from,
				message: msg?.message?.text,
			};
		});

		res.json(projectMessages);
	} catch (error) {
		next(error);
	}
};

module.exports.createGroupChat = async (req, res) => {
	if (!req.body.users || !req.body.name) {
		return res.status(400).send({ message: "Please Fill all the feilds" });
	}

	var users = JSON.parse(req.body.users);

	if (users.length < 2) {
		return res
			.status(400)
			.send("More than 2 users are required to form a group chat");
	}

	users.push(req.user);

	try {
		const groupChat = await Chat.create({
			chatName: req.body.name,
			users: users,
			isGroupChat: true,
			groupAdmin: req.user,
		});

		const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
			.populate("users", "-password")
			.populate("groupAdmin", "-password");

		res.status(200).json(fullGroupChat);
	} catch (error) {
		res.status(400);
		throw new Error(error.message);
	}
};

//add to group
module.exports.addToGroup = async (req, res) => {
	const { chatId, userId } = req.body;

	// check if the requester is admin

	const added = await Chat.findByIdAndUpdate(
		chatId,
		{
			$push: { users: userId },
		},
		{
			new: true,
		}
	)
		.populate("users", "-password")
		.populate("groupAdmin", "-password");

	if (!added) {
		res.status(404);
		throw new Error("Chat Not Found");
	} else {
		res.json(added);
	}
};

module.exports.allchats = async (req, res) => {
	Chat.find((err, docs) => {
		if (!err) {
			res.send(docs);
			return docs;
		} else {
			console.log("Failed to retrieve the Course List: " + err);
		}
	});
};
