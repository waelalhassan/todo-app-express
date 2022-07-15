const tasks = require("../model/tasks.js");

exports.get = (req, res) => {
  const id = req.query.id;
  if (id) {
    tasks
      .findById(id)
      .then((data) => {
        if (data.length == 0) {
          res.status(404).json({
            error: true,
            message: "not found",
          });
        } else {
          res.json(data);
        }
      })
      .catch((err) => {
        res.status(404).json({
          error: true,
          message: err,
        });
      });
  } else {
    tasks
      .find()
      .then((data) => {
        if (data.length == 0) {
          res.status(200).send([]);
        } else {
          res.json(data);
        }
      })
      .catch((err) => {
        res.status(500).json({
          error: true,
          message: err,
        });
      });
  }
};

exports.add = (req, res) => {
  if (req.body.name == "")
    return res.json({ error: true, message: "name required" });

  const newTask = new tasks({
    name: req.body.name,
  });

  newTask
    .save()
    .then((data) => {
      res.json({
        error: false,
        message: "success",
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: true,
        message: err,
      });
    });
};

exports.update = (req, res) => {
  const id = req.params.id;
  tasks
    .findByIdAndUpdate(id, req.body)
    .then((data) => {
      res.json({
        error: false,
        message: "success",
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: true,
        message: err,
      });
    });
};

exports.delete = (req, res) => {
  const id = req.params.id;
  tasks
    .findByIdAndDelete(id)
    .then(() => {
      res.json({
        error: false,
        message: "success",
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: true,
        message: err,
      });
    });
};
