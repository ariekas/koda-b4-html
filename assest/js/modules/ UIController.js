// modules/UIController.js
export class UIController {
  constructor(taskManager) {
    this.taskManager = taskManager;
  }

  init() {
    this.setupTaskOptionsToggle();
    this.setupMoreVerticalMenu();
    this.setupCompletedToggle();
    this.setupOutsideClick();
  }

  setupTaskOptionsToggle() {
    $(document).on("click", ".task-options", (e) => {
      e.preventDefault();
      const subtaskSection = $(e.currentTarget)
        .closest(".task-item")
        .find(".subtask-section");
      const arrow = $(e.currentTarget).find("svg");

      if (subtaskSection.is(":visible")) {
        subtaskSection.slideUp(200);
        arrow.removeClass("rotate-180").addClass("rotate-0");
      } else {
        subtaskSection.slideDown(200);
        arrow.removeClass("rotate-0").addClass("rotate-180");
      }
    });
  }

  setupMoreVerticalMenu() {
    $(document).on("click", ".more-vertical-btn", (e) => {
      e.preventDefault();
      e.stopPropagation();

      $(".edit-delete-menu").removeClass("flex").addClass("hidden");

      const taskItem = $(e.currentTarget).closest(".task-item");
      let menu = taskItem.find(".edit-delete-menu");

      if (menu.length === 0) {
        const menuHTML = this.buildEditDeleteMenu();
        $(e.currentTarget).parent().append(menuHTML);
        menu = taskItem.find(".edit-delete-menu");
      }

      menu.removeClass("hidden").addClass("flex");
    });
  }

  setupCompletedToggle() {
    $("#completed-toggle").click(() => {
      const completedTasks = $("#completed-tasks");
      const arrow = $("#completed-arrow");

      if (completedTasks.hasClass("hidden")) {
        completedTasks.removeClass("hidden").slideDown(300);
        arrow.removeClass("-rotate-90").addClass("rotate-0");
      } else {
        completedTasks.slideUp(300, function () {
          $(this).addClass("hidden");
        });
        arrow.removeClass("rotate-0").addClass("-rotate-90");
      }
    });
  }

  setupOutsideClick() {
    $(document).click((e) => {
      if (!$(e.target).closest(".more-vertical-btn, .edit-delete-menu").length) {
        $(".edit-delete-menu").removeClass("flex").addClass("hidden");
      }
    });
  }

  buildEditDeleteMenu() {
    return `
      <div class="edit-delete-menu hidden flex-col gap-4 absolute top-12 z-20 h-[145px] shadow-md border bg-white border-gray-200 p-[24px] w-[13rem] rounded-md">
        <div class="flex gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded edit-task-btn">
          <svg xmlns="http://www.w3.org/2000/svg" width="23" height="20" viewBox="0 0 24 24">
            <path fill="#7A7F83" d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75zM20.71 7.04a.996.996 0 0 0 0-1.41l-2.34-2.34a.996.996 0 0 0-1.41 0l-1.83 1.83l3.75 3.75z"/>
          </svg>
          <p class="text-[#293038]">Rename task</p>
        </div>
        <div class="flex gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded delete-task-btn">
          <svg xmlns="http://www.w3.org/2000/svg" width="23" height="20" viewBox="0 0 24 24">
            <path fill="#FF5F26" d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6zM19 4h-3.5l-1-1h-5l-1 1H5v2h14z"/>
          </svg>
          <p class="text-[#293038]">Delete task</p>
        </div>
      </div>
    `;
  }
}