// modules/SortManager.js
export class SortManager {
  constructor(taskManager) {
    this.taskManager = taskManager;
  }

  init() {
    this.setupSortToggle();
    this.setupSortOptions();
    this.setupOutsideClick();
  }

  setupSortToggle() {
    $("#sort-toggle-btn").click((e) => {
      e.preventDefault();
      e.stopPropagation();

      const sortBox = $("#sort-box");
      const arrow = $("#sort-arrow");

      sortBox.toggleClass("hidden flex");
      arrow.toggleClass("rotate-180");
    });
  }

  setupSortOptions() {
    $(".sort-option").click((e) => {
      e.preventDefault();

      const sortType = $(e.currentTarget).data("sort");
      const radio = $(e.currentTarget).find('input[type="radio"]');

      $('input[name="sort"]').prop("checked", false);
      radio.prop("checked", true);

      this.taskManager.setCurrentSort(sortType);

      const labelText = this.getSortLabel(sortType);
      $("#current-sort-label").text(labelText);

      this.sortTasks(sortType);

      $("#sort-box").addClass("hidden").removeClass("flex");
      $("#sort-arrow").removeClass("rotate-180");
    });
  }

  setupOutsideClick() {
    $(document).click((e) => {
      if (!$(e.target).closest("#sort-toggle-btn, #sort-box").length) {
        $("#sort-box").addClass("hidden").removeClass("flex");
        $("#sort-arrow").removeClass("rotate-180");
      }
    });
  }

  getSortLabel(sortType) {
    const labels = {
      date: "By Tanggal",
      time: "By Time",
      newest: "Terbaru"
    };
    return labels[sortType] || "By Tanggal";
  }

  sortTasks(sortType) {
    const tasksContainer = $(".tasks-container");
    const tasks = tasksContainer.find(".task-item").get();

    if (tasks.length === 0) return;

    tasks.sort((a, b) => {
      const taskA = $(a);
      const taskB = $(b);

      switch (sortType) {
        case "date":
          return this.sortByDate(taskA, taskB);
        case "time":
          return this.sortByTime(taskA, taskB);
        case "newest":
          return this.sortByNewest(taskA, taskB);
        default:
          return 0;
      }
    });

    tasksContainer.fadeOut(200, function () {
      tasksContainer.empty();
      $.each(tasks, (index, task) => {
        tasksContainer.append(task);
      });
      tasksContainer.fadeIn(200);
    });
  }

  sortByDate(taskA, taskB) {
    const dateA = new Date(taskA.data("date") || "2025-12-31");
    const dateB = new Date(taskB.data("date") || "2025-12-31");
    return dateA - dateB;
  }

  sortByTime(taskA, taskB) {
    const timeA = this.extractTime(taskA.find(".bg-\\[\\#FFEBD3\\]").text());
    const timeB = this.extractTime(taskB.find(".bg-\\[\\#FFEBD3\\]").text());
    return timeA.localeCompare(timeB);
  }

  sortByNewest(taskA, taskB) {
    const createdA = new Date(taskA.data("created") || "2025-01-01");
    const createdB = new Date(taskB.data("created") || "2025-01-01");
    return createdB - createdA;
  }

  extractTime(tagText) {
    const timeMatch = tagText.match(/(\d{1,2}:\d{2})/);
    return timeMatch ? timeMatch[1] : "23:59";
  }
}