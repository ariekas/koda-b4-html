export class CheckboxHandler {
  constructor(taskManager) {
    this.taskManager = taskManager;
  }

  init() {
    this.setupTaskCheckbox();
    this.setupCustomCheckboxClick();
    this.setupSubtaskCheckbox();
  }

  setupTaskCheckbox() {
    $(document).on("change", ".task-checkbox", (e) => {
      const $checkbox = $(e.currentTarget);
      const $customCheckbox = $checkbox.parent().find(".checkbox-custom");
      const $checkmark = $checkbox.parent().find(".checkmark");
      const taskItem = $checkbox.closest(".task-item");
      const taskLabel = $checkbox.closest(".flex.gap-4.items-center").find(".task-label");

      if ($checkbox.is(":checked")) {
        this.checkTask($customCheckbox, $checkmark, taskLabel, taskItem);
      } else {
        this.uncheckTask($customCheckbox, $checkmark, taskLabel, taskItem);
      }
    });
  }

  setupCustomCheckboxClick() {
    $(document).on("click", ".checkbox-custom", (e) => {
      e.preventDefault();
      const $checkbox = $(e.currentTarget).siblings('input[type="checkbox"]');
      if (!$checkbox.prop("disabled")) {
        $checkbox.prop("checked", !$checkbox.prop("checked")).trigger("change");
      }
    });
  }

  setupSubtaskCheckbox() {
    $(document).on("change", ".subtask-checkbox", (e) => {
      const $checkbox = $(e.currentTarget);
      const $customCheckbox = $checkbox.parent().find(".checkbox-custom");
      const $checkmark = $checkbox.parent().find(".checkmark");
      const subtaskItem = $checkbox.closest(".subtask-item");
      const input = subtaskItem.find(".subtask-name-input");

      if ($checkbox.is(":checked")) {
        $customCheckbox.addClass("checkbox-checked");
        $checkmark.addClass("checkmark-visible");
        input.addClass("subtask-completed");
      } else {
        $customCheckbox.removeClass("checkbox-checked");
        $checkmark.removeClass("checkmark-visible");
        input.removeClass("subtask-completed");
      }
    });
  }

  checkTask($customCheckbox, $checkmark, taskLabel, taskItem) {
    $customCheckbox.addClass("checkbox-checked");
    $checkmark.addClass("checkmark-visible");
    taskLabel.addClass("task-completed");

    setTimeout(() => {
      this.taskManager.taskMovement.moveToCompleted(taskItem);
    }, 500);
  }

  uncheckTask($customCheckbox, $checkmark, taskLabel, taskItem) {
    $customCheckbox.removeClass("checkbox-checked");
    $checkmark.removeClass("checkmark-visible");
    taskLabel.removeClass("task-completed");

    if (taskItem.parent().is("#completed-tasks")) {
      this.taskManager.taskMovement.moveToActive(taskItem);
    }
  }
}