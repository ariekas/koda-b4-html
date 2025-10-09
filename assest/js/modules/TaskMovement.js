export class TaskMovement {
  constructor(taskManager) {
    this.taskManager = taskManager;
  }

  moveToCompleted(taskElement) {
    const taskClone = taskElement.clone();

    $("#completed-tasks").append(taskClone);

    taskElement.fadeOut(300, () => {
      taskElement.remove();
      this.updateCompletedCount();
    });

    if ($("#completed-tasks").hasClass("hidden")) {
      $("#completed-tasks").removeClass("hidden").hide().slideDown(300);
      $("#completed-arrow").removeClass("-rotate-90").addClass("rotate-0");
    }
  }

  moveToActive(taskElement) {
    const taskClone = taskElement.clone();

    $(".tasks-container").append(taskClone);

    taskClone.hide().fadeIn(300);

    setTimeout(() => {
      this.taskManager.sortManager.sortTasks(this.taskManager.getCurrentSort());
    }, 400);

    taskElement.fadeOut(200, () => {
      taskElement.remove();
      this.updateCompletedCount();

      if ($("#completed-tasks").children().length === 0) {
        $("#completed-tasks").slideUp(300, function () {
          $(this).addClass("hidden");
        });
        $("#completed-arrow").removeClass("rotate-0").addClass("-rotate-90");
      }
    });
  }

  updateCompletedCount() {
    const completedCount = $("#completed-tasks").children().length;
    $("#completed-count").text(completedCount);
  }
}