async function getAllTasks() {
  const api = await fetch("/api/tasks");
  const result = await api.json();
  return result;
}

function loading(active) {
  const loading = document.querySelector("[loading]");
  if (active) {
    loading.classList.add("active");
  } else {
    loading.classList.remove("active");
  }
}

DisplayTasks();
function DisplayTasks(filter_id = "3") {
  getAllTasks().then((DataTasks) => {
    const fetch_data_tasks = document.querySelector("[fetch-data-tasks]");
    const form_filter_radios = document.querySelectorAll(
      "[form-filter] input[type='radio']"
    );

    let cache = "";
    if (fetch_data_tasks) {
      function formattingDate(tDate) {
        return new Date(tDate).toLocaleDateString("en-US");
      }

      form_filter_radios.forEach((radio) => {
        radio.onclick = function () {
          const val = radio.value;
          handleFilter(val);
        };
        if (radio.value == filter_id) {
          radio.checked = true;
        }
      });

      function handleFilter(val) {
        const skillsCompleted =
          DataTasks.length > 0 ? DataTasks.filter((e) => e.completed) : [];
        const skillsUnCompleted =
          DataTasks.length > 0 ? DataTasks.filter((e) => !e.completed) : [];

        switch (val) {
          case "1":
            handleData(DataTasks);
            break;
          case "2":
            handleData(skillsCompleted);
            break;
          case "3":
            handleData(skillsUnCompleted);
            break;
          default:
            handleData(DataTasks);
            break;
        }
      }

      handleFilter(filter_id);

      function handleData(data) {
        cache = "";
        if (data.length > 0) {
          for (let i in data) {
            cache += `<tr class="${
              data[i].completed ? "completed" : ""
            }" task-row class="task-row" task-id="${data[i]._id}">
          <td><input type="checkbox" value="${
            data[i]._id
          }" class="form-check-input" input-select-task></td>
          <td>${i}</td>
          <td>${data[i].name}</td>
          <td>${formattingDate(data[i].createdAt)}</td>
          <td>${formattingDate(data[i].updatedAt)}</td>
          <td>
            <button task-id="${
              data[i]._id
            }" type="button" class="border-0 btn-rm">
              <svg xmlns="http://www.w3.org/2000/svg" fill="red" width="15px" viewBox="0 0 448 512"><path d="M32 464a48 48 0 0 0 48 48h288a48 48 0 0 0 48-48V128H32zm272-256a16 16 0 0 1 32 0v224a16 16 0 0 1-32 0zm-96 0a16 16 0 0 1 32 0v224a16 16 0 0 1-32 0zm-96 0a16 16 0 0 1 32 0v224a16 16 0 0 1-32 0zM432 32H312l-9.4-18.7A24 24 0 0 0 281.1 0H166.8a23.72 23.72 0 0 0-21.4 13.3L136 32H16A16 16 0 0 0 0 48v32a16 16 0 0 0 16 16h416a16 16 0 0 0 16-16V48a16 16 0 0 0-16-16z"/></svg>
            </button>
          </td>
        </tr>`;
          }
          fetch_data_tasks.innerHTML = cache;
          handleDeleteTask();
          handleAddTaskToCompletedList();
          handleSelectTask();
          runSelectSingleTask();
          document.querySelector("[input-select-all]").disabled = false;
        } else {
          fetch_data_tasks.innerHTML = `<div class="no-tasks"> No Tasks </div>`;
          document.querySelector("[input-select-all]").disabled = true;
          document.querySelector("[input-select-all]").checked = false;
          document
            .querySelector("[actions-selected-tasks]")
            .classList.remove("active");
        }
      }
    }
  });
}

// add task
const input_add_task = document.querySelector("[input-add-task]");
const btn_add_task = document.querySelector("[btn-add-task]");
const form_add_task = document.querySelector("[form-add-task]");
form_add_task.onsubmit = (e) => e.preventDefault();

input_add_task.onkeyup = function () {
  if (!this.value) return (btn_add_task.disabled = true);
  btn_add_task.disabled = false;

  if (e.keyCode == 13) {
    e.preventDefault();
    btn_add_task.click();
  }
};

const inputNames = form_add_task.querySelectorAll("[name]");

form_add_task.onsubmit = function () {
  const data = {};

  new FormData(form_add_task).forEach((value, key) => (data[key] = value));

  function handleResult(result) {
    if (!result.error && result.message == "success") {
      DisplayTasks("3");
      btn_add_task.disabled = true;
      input_add_task.value = "";
    } else if (result.error && result.message == "name required") {
      alert("The task field is required");
    } else if (result.error) {
      alert("Something went wrong, try again later");
    }
  }

  fetch("/api/tasks/add", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((res) => res.json())
    .then((result) => {
      handleResult(result);
    })
    .catch((err) => {
      console.error(err);
    });
};

// delete task
function handleDeleteTask() {
  const btn_rm = document.querySelectorAll(".btn-rm");

  function handleResult(result) {
    if (!result.error && result.message == "success") {
      DisplayTasks();
    }
    loading(false);
  }

  btn_rm.forEach((btn) => {
    btn.onclick = function () {
      const id = btn.getAttribute("task-id");

      const conf = confirm("Are you sure ?");

      if (conf) {
        loading(true);
        fetch(`/api/tasks/delete/${id}`, {
          method: "DELETE",
          headers: {
            Accept: "application/json",
          },
        })
          .then((res) => res.json())
          .then((result) => handleResult(result))
          .catch((err) => console.error(err));
      }
    };
  });
}

// add task to completed list
function handleAddTaskToCompletedList() {
  const task_row = document.querySelectorAll("[task-row]");
  task_row.forEach((task) => {
    task.ondblclick = function () {
      const id = task.getAttribute("task-id");
      addTaskToCompleted(id);
    };
  });
}
function addTaskToCompleted(id) {
  getAllTasks().then((tasks) => {
    const form_filter_radios = document.querySelectorAll(
      "[form-filter] input[type='radio']"
    );

    const checkTask = tasks.filter((e) => e._id == id)[0].completed;

    function handleResult(result) {
      if (!result.error && result.message == "success") {
        document.querySelector("[btn-apply-action]").disabled = true;
        document.querySelector("[select-action]").children[0].selected = true;

        form_filter_radios.forEach((e) => {
          if (e.checked) {
            DisplayTasks(e.value);
          }
        });
      }
      setTimeout(() => {
        loading(false);
      }, 2000);
    }

    fetch(`/api/tasks/update/${id}`, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        completed: checkTask ? false : true,
      }),
    })
      .then((res) => res.json())
      .then((result) => handleResult(result))
      .catch((err) => console.error(err));
  });
}

const input_select_all = document.querySelector("[input-select-all]");
window.cache_seleted_tasks = [];

function handleSelectTask() {
  const input_select_task = document.querySelectorAll("[input-select-task]");
  window.cache_seleted_tasks = [];
  input_select_task.forEach((e) => {
    if (e.checked) {
      cache_seleted_tasks.push(e.value);
    }
  });

  const actions_selected_tasks = document.querySelector(
    "[actions-selected-tasks]"
  );
  if (cache_seleted_tasks.length > 0) {
    actions_selected_tasks.classList.add("active");
  } else {
    actions_selected_tasks.classList.remove("active");
  }
}

input_select_all.onclick = function () {
  let swit = this.checked;
  const task_row = document.querySelectorAll("[task-row]");
  task_row.forEach((e) => {
    const task = e.querySelector("[input-select-task]");
    task.checked = swit;
  });
  handleSelectTask();
};

function runSelectSingleTask() {
  const input_select_task = document.querySelectorAll("[input-select-task]");
  input_select_task.forEach((e) => {
    e.onclick = function () {
      handleSelectTask();
    };
  });
}

// select action
const select_action = document.querySelector("[select-action]");
const btn_apply_action = document.querySelector("[btn-apply-action]");

select_action.addEventListener("change", function () {
  if (this.value == 0) {
    btn_apply_action.disabled = true;
  } else {
    btn_apply_action.disabled = false;
  }
});

btn_apply_action.onclick = function () {
  function handleResult(result) {
    DisplayTasks();
    btn_apply_action.disabled = true;
    document.querySelector("[select-action]").children[0].selected = true;

    setTimeout(() => {
      loading(false);
    }, 2000);
  }

  if (select_action.value == 1) {
    const conf = confirm("All selected tasks will be deleted, are you sure?");
    if (conf) {
      loading(true);
      for (let i of cache_seleted_tasks) {
        fetch(`/api/tasks/delete/${i}`, {
          method: "DELETE",
          headers: {
            Accept: "application/json",
          },
        })
          .then((res) => res.json())
          .then((result) => handleResult(result))
          .catch((err) => console.error(err));
      }
    }
  } else if (select_action.value == 2) {
    loading(true);
    for (let i of cache_seleted_tasks) {
      addTaskToCompleted(i);
    }
  } else {
    alert("Select Action");
  }
};
