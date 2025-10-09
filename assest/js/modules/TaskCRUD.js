import { TaskBuilder } from './TaskBuilder.js';

export class TaskCRUD {
  constructor(taskManager) {
    this.taskManager = taskManager;
    this.taskBuilder = new TaskBuilder(taskManager);
  }

  init() {
    this.setupCreateButton();
    this.setupEditButton();
    this.setupSaveEdit();
    this.setupCancelEdit();
    this.setupDeleteButton();
  }

  setupCreateButton() {
    $(".tambah-tugas-btn").click((e) => {
      e.preventDefault();
      if (!this.taskManager.getCreating()) {
        this.showCreateTaskForm();
        this.taskManager.setCreating(true);
      }
    });
  }

  showCreateTaskForm() {
    const today = new Date();
    const todayStr = today.toISOString().split("T")[0];

    const createTaskHTML = this.taskBuilder.buildCreateForm(todayStr);
    $(".tasks-container").prepend(createTaskHTML);
    $(".task-name-input").focus();

    this.bindCreateFormEvents();
  }

  bindCreateFormEvents() {
    $(".create-task-form").on("submit", (e) => {
      e.preventDefault();
      this.saveNewTask();
    });

    $(".cancel-task-btn").click((e) => {
      e.preventDefault();
      this.cancelCreateTask();
    });

    $(".task-name-input").keypress((e) => {
      if (e.which === 13) {
        e.preventDefault();
        this.saveNewTask();
      }
    });

    $(document).keyup((e) => {
      if (e.key === "Escape") {
        this.cancelCreateTask();
      }
    });
  }

  saveNewTask() {
    const taskName = $(".task-name-input").val().trim();
    const taskDesc = $(".task-desc-input").val().trim();
    const taskDate = $(".task-date-input").val();

    if (!taskName) {
      this.showInputError($(".task-name-input"));
      return;
    }

    const taskData = this.prepareTaskData(taskName, taskDesc, taskDate);
    const newTaskHTML = this.taskBuilder.buildTaskItem(
      taskData,
      this.taskManager.taskCounter
    );

    $(".create-task-form").remove();
    $(".tasks-container").append(newTaskHTML);

    $(".new-task").hide().fadeIn(300, function () {
      $(this).removeClass("new-task");
    });

    setTimeout(() => {
      this.taskManager.sortManager.sortTasks(this.taskManager.getCurrentSort());
    }, 400);

    this.taskManager.incrementTaskCounter();
    this.taskManager.setCreating(false);
  }

  prepareTaskData(taskName, taskDesc, taskDate) {
    const now = new Date();
    const currentTime = now.toTimeString().slice(0, 5);
    
    let timeTag = "Hari Ini";
    let selectedTaskDate = taskDate;

    if (taskDate) {
      const selectedDate = new Date(taskDate);
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const dateStr = selectedDate.toISOString().split("T")[0];
      selectedTaskDate = dateStr;

      if (dateStr === today.toISOString().split("T")[0]) {
        timeTag = `Hari Ini, ${currentTime}`;
      } else if (dateStr === tomorrow.toISOString().split("T")[0]) {
        timeTag = `Besok, ${currentTime}`;
      } else {
        const options = { day: "numeric", month: "short" };
        timeTag = `${selectedDate.toLocaleDateString("id-ID", options)}, ${currentTime}`;
      }
    } else {
      selectedTaskDate = now.toISOString().split("T")[0];
      timeTag = `Hari Ini, ${currentTime}`;
    }

    return {
      name: taskName,
      desc: taskDesc,
      date: selectedTaskDate,
      time: currentTime,
      timeTag: timeTag,
      created: new Date().toISOString()
    };
  }

  cancelCreateTask() {
    $(".create-task-form").fadeOut(200, function () {
      $(this).remove();
    });
    this.taskManager.setCreating(false);
    $(document).off("keyup");
  }

  setupEditButton() {
    $(document).on("click", ".edit-task-btn", (e) => {
      e.preventDefault();
      e.stopPropagation();

      const taskItem = $(e.currentTarget).closest(".task-item");
      this.enterEditMode(taskItem);
    });
  }

  enterEditMode(taskItem) {
    const taskLabel = taskItem.find(".task-label").first();
    const taskDesc = taskItem.find(".text-\\[\\#7A7F83\\].text-sm").first();
    const currentName = taskLabel.text();
    const currentDesc = taskDesc.text();

    $(".edit-delete-menu").removeClass("flex").addClass("hidden");

    const taskId = taskItem.find(".task-checkbox").first().attr("id");
    
    taskLabel.replaceWith(
      `<input type="text" class="edit-task-name task-input-editing flex-1 outline-none text-lg text-[#293038]" value="${currentName}">`
    );

    if (taskDesc.length > 0) {
      taskDesc.replaceWith(
        `<input type="text" class="edit-task-desc text-sm outline-none text-[#7A7F83] w-full" value="${currentDesc}" placeholder="Deskripsi Tugas (Optional)">`
      );
    } else {
      taskItem.find(".task-options").parent().after(
        `<input type="text" class="edit-task-desc text-sm mt-1 outline-none text-[#7A7F83] w-full" value="" placeholder="Deskripsi Tugas (Optional)">`
      );
    }

    const editButtons = this.taskBuilder.buildEditButtons();
    taskItem.find(".edit-task-desc").after(editButtons);
    taskItem.find(".edit-task-name").focus().select();

    taskItem.data("original-name", currentName);
    taskItem.data("original-desc", currentDesc);
    taskItem.data("original-task-id", taskId);
  }

  setupSaveEdit() {
    $(document).on("click", ".save-edit-btn", (e) => {
      e.preventDefault();

      const taskItem = $(e.currentTarget).closest(".task-item");
      const newName = taskItem.find(".edit-task-name").val().trim();
      const newDesc = taskItem.find(".edit-task-desc").val().trim();

      if (!newName) {
        taskItem.find(".edit-task-name").focus();
        return;
      }

      const taskId = taskItem.data("original-task-id");

      taskItem.find(".edit-task-name").replaceWith(
        `<label for="${taskId}" class="task-label text-[#293038] text-lg cursor-pointer">${newName}</label>`
      );

      if (newDesc) {
        taskItem.find(".edit-task-desc").replaceWith(
          `<p class="text-[#7A7F83] text-sm mt-1">${newDesc}</p>`
        );
      } else {
        taskItem.find(".edit-task-desc").remove();
      }

      taskItem.find(".edit-buttons").remove();
    });
  }

  setupCancelEdit() {
    $(document).on("click", ".cancel-edit-btn", (e) => {
      e.preventDefault();

      const taskItem = $(e.currentTarget).closest(".task-item");
      const originalName = taskItem.data("original-name");
      const originalDesc = taskItem.data("original-desc");
      const taskId = taskItem.data("original-task-id");

      taskItem.find(".edit-task-name").replaceWith(
        `<label for="${taskId}" class="task-label text-[#293038] text-lg cursor-pointer">${originalName}</label>`
      );

      if (originalDesc) {
        taskItem.find(".edit-task-desc").replaceWith(
          `<p class="text-[#7A7F83] text-sm mt-1">${originalDesc}</p>`
        );
      } else {
        taskItem.find(".edit-task-desc").remove();
      }

      taskItem.find(".edit-buttons").remove();
    });
  }

  setupDeleteButton() {
    $(document).on("click", ".delete-task-btn", (e) => {
      e.preventDefault();
      e.stopPropagation();

      const taskItem = $(e.currentTarget).closest(".task-item");

      if (confirm("Apakah Anda yakin ingin menghapus tugas ini beserta semua subtask-nya?")) {
        taskItem.fadeOut(300, () => {
          taskItem.remove();
          this.taskManager.taskMovement.updateCompletedCount();
        });
      }

      $(".edit-delete-menu").removeClass("flex").addClass("hidden");
    });
  }

  showInputError(inputField) {
    inputField.addClass("input-error");
    setTimeout(() => {
      inputField.removeClass("input-error");
    }, 1000);
    inputField.focus();
  }
}