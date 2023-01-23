/** @format */

const {
	addMessage,
	getAllMessage,
	createGroupChat,
	addToGroup,
	allchats,
} = require("../controllers/messagesController");

const router = require("express").Router();

router.post("/addmsg/", addMessage);
router.post("/getmsg", getAllMessage);
router.post("/creategroup/", createGroupChat);
router.post("/addtogroup/").put(addToGroup);
router.get("/allchats", allchats);
module.exports = router;
