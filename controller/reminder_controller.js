const { reminderModel } = require("../models/reminderModel");

let remindersController = {
  list: async (req, res) => {
    const reminders = await reminderModel.findByUser(req.user.id);
    res.render("reminder/index", {
      reminders,
      user: req.user.name,
      imageUrl: req.user.imageUrl,
    });
  },

  new: (req, res) => {
    res.render("reminder/create");
  },

  listOne: async (req, res) => {
    const reminderToFind = req.params.id;
    const reminder = await reminderModel.findById(reminderToFind);
    if (reminder) {
      res.render("reminder/single-reminder", { reminderItem: reminder });
    } else {
      res.redirect("/reminders");
    }
  },

  create: async (req, res) => {
    const userId = req.user.id;
    const title = req.body.title;
    const description = req.body.description;

    await reminderModel.addOne(userId, title, description);

    res.redirect("/reminders");
  },

  edit: async (req, res) => {
    const reminderToFind = req.params.id;
    const reminder = await reminderModel.findById(reminderToFind);

    res.render("reminder/edit", { reminderItem: reminder });
  },

  update: async (req, res) => {
    const reminderID = req.params.id;
    const reminderData = Object.assign({}, req.body);
    reminderData.completed = reminderData.completed === "true";

    await reminderModel.updateOne(reminderID, reminderData);

    res.redirect("/reminder/" + reminderID);
  },

  delete: async (req, res) => {
    const reminderId = req.params.id;
    await reminderModel.deleteOne(reminderId);
    res.redirect("/reminders");
  },
};

module.exports = remindersController;
