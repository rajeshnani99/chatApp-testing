/** @format */

const mongoose = require("mongoose");

const chatModel = mongoose.Schema(
	{
		chatName: { type: String, trim: true },
		isGroupChat: { type: Boolean, default: false },
		users: [{ type: mongoose.Schema.Types.ObjectId, ref: "Users" }],
		latestMessage: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Message",
		},
		groupAdmin: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Chat", chatModel);
