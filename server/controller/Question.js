import Question from "../models/Question.js";
import mongoose from "mongoose";

export const Askquestion = async (req, res) => {
    const postquestiondata = req.body;

    const postquestion = new Question(postquestiondata); // ✅ gets userid from body

    try {
        await postquestion.save();
        res.status(200).json("Posted a question successfully");
    } catch (error) {
        console.log(error);
        res.status(404).json("Couldn't post a new question");
    }
};

export const getallquestion = async (req, res) => {
    try {
        const questionlist = await Question.find().sort({ askedon: -1 });
        res.status(200).json(questionlist);
    } catch (error) {
        console.log(error);
        res.status(404).json({ message: error.message });
    }
};

export const deletequestion = async (req, res) => {
    const { id: _id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(_id)) {
        return res.status(404).send("Question unavailable...");
    }
    try {
        await Question.findByIdAndDelete(_id);
        res.status(200).json({ message: "Successfully deleted..." });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

export const votequestion = async (req, res) => {
    const { id: _id } = req.params;
    const { value, userid } = req.body;

    if (!mongoose.Types.ObjectId.isValid(_id)) {
        return res.status(404).send("Question unavailable...");
    }

    try {
        const question = await Question.findById(_id);
        const upindex = question.upvote.findIndex(id => id === String(userid));
        const downindex = question.downvote.findIndex(id => id === String(userid));

        if (value === "upvote") {
            if (downindex !== -1) {
                question.downvote = question.downvote.filter(id => id !== String(userid));
            }
            if (upindex === -1) {
                question.upvote.push(userid);
            } else {
                question.upvote = question.upvote.filter(id => id !== String(userid));
            }
        } else if (value === "downvote") {
            if (upindex !== -1) {
                question.upvote = question.upvote.filter(id => id !== String(userid));
            }
            if (downindex === -1) {
                question.downvote.push(userid);
            } else {
                question.downvote = question.downvote.filter(id => id !== String(userid));
            }
        }

        await Question.findByIdAndUpdate(_id, question);
        res.status(200).json({ message: "Voted successfully." });

    } catch (error) {
        res.status(404).json({ message: "ID not found" });
    }
};
