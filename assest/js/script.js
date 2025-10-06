$(document).ready(function () {
  let currentSort = "date";
  let taskCounter = 1;
  let isCreating = false;

  // fungsi sort
  $("#sort-toggle-btn").click(function (e) {
    e.preventDefault();
    e.stopPropagation();

    const sortBox = $("#sort-box");
    const arrow = $("#sort-arrow");

    if (sortBox.hasClass("hidden")) {
      sortBox.removeClass("hidden").addClass("flex");
      arrow.addClass("rotate-180");
    } else {
      sortBox.addClass("hidden").removeClass("flex");
      arrow.removeClass("rotate-180");
    }
  });

//   cloce and open sort button
  $(document).click(function (e) {
    if (!$(e.target).closest("#sort-toggle-btn, #sort-box").length) {
      $("#sort-box").addClass("hidden").removeClass("flex");
      $("#sort-arrow").removeClass("rotate-180");
    }
    if (!$(e.target).closest(".more-vertical-btn, .edit-delete-menu").length) {
      $(".edit-delete-menu").removeClass("flex").addClass("hidden");
    }
  });

  $(".sort-option").click(function (e) {
    e.preventDefault();

    const sortType = $(this).data("sort");
    const radio = $(this).find('input[type="radio"]');

    $('input[name="sort"]').prop("checked", false);
    radio.prop("checked", true);

    currentSort = sortType;

    let labelText = "";
    switch (sortType) {
      case "date":
        labelText = "By Tanggal";
        break;
      case "time":
        labelText = "By Time";
        break;
      case "newest":
        labelText = "Terbaru";
        break;
    }
    $("#current-sort-label").text(labelText);

    sortTasks(sortType);

    $("#sort-box").addClass("hidden").removeClass("flex");
    $("#sort-arrow").removeClass("rotate-180");
  });

  // Function sort taks
  function sortTasks(sortType) {
    const tasksContainer = $(".tasks-container");
    const tasks = tasksContainer.find(".task-item").get();

    if (tasks.length === 0) return;

    tasks.sort(function (a, b) {
      const taskA = $(a);
      const taskB = $(b);

      switch (sortType) {
        case "date":
          const dateA = new Date(taskA.data("date") || "2025-12-31");
          const dateB = new Date(taskB.data("date") || "2025-12-31");
          return dateA - dateB;

        case "time":
          const timeA = extractTime(taskA.find(".bg-\\[\\#FFEBD3\\]").text());
          const timeB = extractTime(taskB.find(".bg-\\[\\#FFEBD3\\]").text());
          return timeA.localeCompare(timeB);

        case "newest":
          const createdA = new Date(taskA.data("created") || "2025-01-01");
          const createdB = new Date(taskB.data("created") || "2025-01-01");
          return createdB - createdA;

        default:
          return 0;
      }
    });

    tasksContainer.fadeOut(200, function () {
      tasksContainer.empty();
      $.each(tasks, function (index, task) {
        tasksContainer.append(task);
      });
      tasksContainer.fadeIn(200);
    });
  }

  function extractTime(tagText) {
    const timeMatch = tagText.match(/(\d{1,2}:\d{2})/);
    return timeMatch ? timeMatch[1] : "23:59";
  }

  // Checkbox 
  $(document).on("change", ".task-checkbox", function () {
    const $checkbox = $(this);
    const $customCheckbox = $checkbox.parent().find(".checkbox-custom");
    const $checkmark = $checkbox.parent().find(".checkmark");
    const taskItem = $checkbox.closest(".task-item");

    if ($checkbox.is(":checked")) {
      $customCheckbox.css({
        backgroundColor: "#FF5F26",
        borderColor: "#FF5F26",
      });
      $checkmark.css("opacity", "1");

      const taskLabel = $checkbox
        .closest(".flex.gap-4.items-center")
        .find(".task-label");
      taskLabel.css({
        textDecoration: "line-through",
        opacity: "0.6",
      });

      setTimeout(() => {
        moveToCompleted(taskItem);
      }, 500);
    } else {
      $customCheckbox.css({
        backgroundColor: "white",
        borderColor: "#CCCED2",
      });
      $checkmark.css("opacity", "0");

      const taskLabel = $checkbox
        .closest(".flex.gap-4.items-center")
        .find(".task-label");
      taskLabel.css({
        textDecoration: "none",
        opacity: "1",
      });

      if (taskItem.parent().is("#completed-tasks")) {
        moveToActive(taskItem);
      }
    }
  });

  $(document).on("click", ".checkbox-custom", function (e) {
    e.preventDefault();
    const $checkbox = $(this).siblings('input[type="checkbox"]');
    if (!$checkbox.prop("disabled")) {
      $checkbox.prop("checked", !$checkbox.prop("checked")).trigger("change");
    }
  });

  // Event listener untuk toggle subtask section
  $(document).on("click", ".task-options", function (e) {
    e.preventDefault();
    const subtaskSection = $(this)
      .closest(".task-item")
      .find(".subtask-section");
    const arrow = $(this).find("svg");

    if (subtaskSection.is(":visible")) {
      subtaskSection.slideUp(200);
      arrow.removeClass("rotate-180").addClass("rotate-0");
    } else {
      subtaskSection.slideDown(200);
      arrow.removeClass("rotate-0").addClass("rotate-180");
    }
  });

  // Event listener untuk menampilkan menu edit/delete
  $(document).on("click", ".more-vertical-btn", function (e) {
    e.preventDefault();
    e.stopPropagation();

    $(".edit-delete-menu").removeClass("flex").addClass("hidden");

    const taskItem = $(this).closest(".task-item");
    let menu = taskItem.find(".edit-delete-menu");

    if (menu.length === 0) {
      const menuHTML = `
                  <div class="edit-delete-menu hidden flex-col gap-4 absolute  top-12 z-20 h-[145px] shadow-md border bg-white border-gray-200 p-[24px] w-[13rem] rounded-md">
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
      $(this).parent().append(menuHTML);
      menu = taskItem.find(".edit-delete-menu");
    }

    menu.removeClass("hidden").addClass("flex");
  });

  // Event listener untuk edit task
  $(document).on("click", ".edit-task-btn", function (e) {
    e.preventDefault();
    e.stopPropagation();

    const taskItem = $(this).closest(".task-item");
    const taskLabel = taskItem.find(".task-label").first();
    const taskDesc = taskItem.find(".text-\\[\\#7A7F83\\].text-sm").first();
    const currentName = taskLabel.text();
    const currentDesc = taskDesc.text();

    $(".edit-delete-menu").removeClass("flex").addClass("hidden");

    taskLabel.replaceWith(
      `<input type="text" class="edit-task-name border-l-2 border-[#FF5F26] pl-1.5 flex-1 outline-none text-lg text-[#293038]" value="${currentName}">`
    );

    if (taskDesc.length > 0) {
      taskDesc.replaceWith(
        `<input type="text" class="edit-task-desc text-sm outline-none text-[#7A7F83] w-full" value="${currentDesc}" placeholder="Deskripsi Tugas (Optional)">`
      );
    } else {
      taskItem
        .find(".task-options")
        .parent()
        .after(
          `<input type="text" class="edit-task-desc text-sm mt-1 outline-none text-[#7A7F83] w-full" value="" placeholder="Deskripsi Tugas (Optional)">`
        );
    }

    const editButtons = `
              <div class="edit-buttons flex gap-2 mt-2">
                  <button class="save-edit-btn px-4 py-2 bg-[#FF5F26] text-white rounded-full text-sm hover:bg-[#e54f20] transition-colors font-medium">
                      Simpan
                  </button>
                  <button class="cancel-edit-btn px-4 py-2 border border-[#CCCED2] text-[#7A7F83] rounded-full text-sm hover:bg-gray-50 transition-colors">
                      Batal
                  </button>
              </div>
          `;
    taskItem.find(".edit-task-desc").after(editButtons);

    taskItem.find(".edit-task-name").focus().select();

    taskItem.data("original-name", currentName);
    taskItem.data("original-desc", currentDesc);
  });

  // Event listener untuk simpan edit
  $(document).on("click", ".save-edit-btn", function (e) {
    e.preventDefault();

    const taskItem = $(this).closest(".task-item");
    const newName = taskItem.find(".edit-task-name").val().trim();
    const newDesc = taskItem.find(".edit-task-desc").val().trim();

    if (!newName) {
      taskItem.find(".edit-task-name").focus();
      return;
    }

    const taskId = taskItem.find(".task-checkbox").first().attr("id");

    taskItem
      .find(".edit-task-name")
      .replaceWith(
        `<label for="${taskId}" class="task-label text-[#293038] text-lg cursor-pointer">${newName}</label>`
      );

    if (newDesc) {
      taskItem
        .find(".edit-task-desc")
        .replaceWith(`<p class="text-[#7A7F83] text-sm mt-1">${newDesc}</p>`);
    } else {
      taskItem.find(".edit-task-desc").remove();
    }

    taskItem.find(".edit-buttons").remove();
  });

  // Event listener untuk batal edit
  $(document).on("click", ".cancel-edit-btn", function (e) {
    e.preventDefault();

    const taskItem = $(this).closest(".task-item");
    const originalName = taskItem.data("original-name");
    const originalDesc = taskItem.data("original-desc");
    const taskId = taskItem.find(".task-checkbox").first().attr("id");

    taskItem
      .find(".edit-task-name")
      .replaceWith(
        `<label for="${taskId}" class="task-label text-[#293038] text-lg cursor-pointer">${originalName}</label>`
      );

    if (originalDesc) {
      taskItem
        .find(".edit-task-desc")
        .replaceWith(
          `<p class="text-[#7A7F83] text-sm mt-1">${originalDesc}</p>`
        );
    } else {
      taskItem.find(".edit-task-desc").remove();
    }

    taskItem.find(".edit-buttons").remove();
  });

  // Event listener untuk delete task
  $(document).on("click", ".delete-task-btn", function (e) {
    e.preventDefault();
    e.stopPropagation();

    const taskItem = $(this).closest(".task-item");

    if (
      confirm(
        "Apakah Anda yakin ingin menghapus tugas ini beserta semua subtask-nya?"
      )
    ) {
      taskItem.fadeOut(300, function () {
        $(this).remove();
        updateCompletedCount();
      });
    }

    $(".edit-delete-menu").removeClass("flex").addClass("hidden");
  });

  // Event listener untuk tambah subtask
  $(document).on("click", ".add-subtask-btn", function (e) {
    e.preventDefault();

    const subtaskList = $(this)
      .closest(".subtask-section")
      .find(".subtask-list");
    const subtaskCounter = subtaskList.children().length + 1;

    const newSubtaskHTML = `
              <div class="flex gap-4 items-center subtask-item">
                  <label class="cursor-pointer relative">
                      <input type="checkbox" class="hidden subtask-checkbox" />
                      <div class="checkbox-custom w-7 h-7 bg-white border border-[#CCCED2] rounded-full flex items-center justify-center transition-all duration-200">
                          <svg class="checkmark w-6 h-6 text-white opacity-0 transition-opacity duration-200" fill="currentColor" viewBox="0 0 20 20">
                              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                          </svg>
                      </div>
                  </label>
                  <input type="text" placeholder="Masukan nama Subtask" class="subtask-name-input flex-1 outline-none text-[#293038]">
                  <button class="delete-subtask-btn hover:bg-gray-200 p-1 rounded transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
                          <path fill="#FF5F26" d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6zM19 4h-3.5l-1-1h-5l-1 1H5v2h14z"/>
                      </svg>
                  </button>
              </div>
          `;

    subtaskList.append(newSubtaskHTML);
    subtaskList.find(".subtask-item:last .subtask-name-input").focus();
  });

  // Event listener untuk delete subtask
  $(document).on("click", ".delete-subtask-btn", function (e) {
    e.preventDefault();

    $(this)
      .closest(".subtask-item")
      .fadeOut(200, function () {
        $(this).remove();
      });
  });

  // Event listener untuk subtask checkbox
  $(document).on("change", ".subtask-checkbox", function () {
    const $checkbox = $(this);
    const $customCheckbox = $checkbox.parent().find(".checkbox-custom");
    const $checkmark = $checkbox.parent().find(".checkmark");
    const subtaskItem = $checkbox.closest(".subtask-item");
    const input = subtaskItem.find(".subtask-name-input");

    if ($checkbox.is(":checked")) {
      $customCheckbox.css({
        backgroundColor: "#FF5F26",
        borderColor: "#FF5F26",
      });
      $checkmark.css("opacity", "1");
      input.css({
        textDecoration: "line-through",
        opacity: "0.6",
      });
    } else {
      $customCheckbox.css({
        backgroundColor: "white",
        borderColor: "#CCCED2",
      });
      $checkmark.css("opacity", "0");
      input.css({
        textDecoration: "none",
        opacity: "1",
      });
    }
  });

  // Event listener untuk button "Tambah tugas"
  $(".tambah-tugas-btn").click(function (e) {
    e.preventDefault();

    if (!isCreating) {
      showCreateTaskForm();
      isCreating = true;
    }
  });

  // Fungsi untuk menampilkan form create task
  function showCreateTaskForm() {
    const today = new Date();
    const todayStr = today.toISOString().split("T")[0];

    const createTaskHTML = `
            <form class="create-task-form flex flex-col items-start gap-3 z-2 mb-4">
                <div class="absolute bg-[#F5F5F5] w-full h-[170px] left-[-15px] top-[-5px] z-[-1] rounded"></div>
                
                <div class="flex flex-row items-center gap-3 w-full">
                    <label class="cursor-pointer relative">
                        <input type="checkbox" class="hidden create-checkbox" disabled />
                        <div class="checkbox-custom w-7 h-7 bg-white border border-[#CCCED2] rounded-full flex items-center justify-center transition-all duration-200">
                            <svg class="checkmark w-6 h-6 text-white opacity-0 transition-opacity duration-200" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                            </svg>
                        </div>
                    </label>
                    <input type="text" placeholder="Masukan nama tugas" class="border-l-2 border-[#FF5F26] pl-1.5 task-name-input flex-1 outline-none text-lg" required>
                </div>
                
                <div class="flex ml-9 gap-2 w-full">
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24">
                        <path fill="none" stroke="#7A7F83" stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M4 6h16M4 12h16M4 18h7" />
                    </svg>
                    <input type="text" placeholder="Deskripsi Tugas (Optional)" class="text-sm task-desc-input flex-1 outline-none text-[#7A7F83]">
                </div>
                
                <div class="flex ml-9 gap-2 w-full">
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24">
                        <path fill="#7A7F83" d="M8.5 14a1.25 1.25 0 1 0 0-2.5a1.25 1.25 0 0 0 0 2.5m0 3.5a1.25 1.25 0 1 0 0-2.5a1.25 1.25 0 0 0 0 2.5m4.75-4.75a1.25 1.25 0 1 1-2.5 0a1.25 1.25 0 0 1 2.5 0M12 17.5a1.25 1.25 0 1 0 0-2.5a1.25 1.25 0 0 0 0 2.5m4.75-4.75a1.25 1.25 0 1 1-2.5 0a1.25 1.25 0 0 1 2.5 0" />
                        <path fill="#7A7F83" fill-rule="evenodd" d="M8 3.25a.75.75 0 0 1 .75.75v.75h6.5V4a.75.75 0 0 1 1.5 0v.758q.228.006.425.022c.38.03.736.098 1.073.27a2.75 2.75 0 0 1 1.202 1.202c.172.337.24.693.27 1.073c.03.365.03.81.03 1.345v7.66c0 .535 0 .98-.03 1.345c-.03.38-.098.736-.27 1.073a2.75 2.75 0 0 1-1.201 1.202c-.338.172-.694.24-1.074.27c-.365.03-.81.03-1.344.03H8.17c-.535 0-.98 0-1.345-.03c-.38-.03-.736-.098-1.073-.27a2.75 2.75 0 0 1-1.202-1.2c-.172-.338-.24-.694-.27-1.074c-.03-.365-.03-.81-.03-1.344V8.67c0-.535 0-.98.03-1.345c.03-.38.098-.736.27-1.073A2.75 2.75 0 0 1 5.752 5.05c.337-.172.693-.24 1.073-.27q.197-.016.425-.022V4A.75.75 0 0 1 8 3.25M7.25 6.5v-.242a6 6 0 0 0-.303.017c-.287.023-.424.065-.514.111a1.25 1.25 0 0 0-.547.547c-.046.09-.088.227-.111.514c-.024.296-.025.68-.025 1.253v.55h12.5V8.7c0-.572 0-.957-.025-1.253c-.023-.287-.065-.424-.111-.514a1.25 1.25 0 0 0-.547-.547c-.09-.046-.227-.088-.515-.111a6 6 0 0 0-.302-.017V6.5a.75.75 0 0 1-1.5 0v-.25h-6.5v.25a.75.75 0 0 1-1.5 0m11 3.75H5.75v6.05c0 .572 0 .957.025 1.252c.023.288.065.425.111.515c.12.236.311.427.547.547c.09.046.227.088.514.111c.296.024.68.025 1.253.025h7.6c.572 0 .957 0 1.252-.025c.288-.023.425-.065.515-.111a1.25 1.25 0 0 0 .547-.547c.046-.09.088-.227.111-.515c.024-.295.025-.68.025-1.252z" clip-rule="evenodd" />
                        <path fill="#7A7F83" fill-rule="evenodd" d="M9.75 7.75A.75.75 0 0 1 10.5 7h3a.75.75 0 0 1 0 1.5h-3a.75.75 0 0 1-.75-.75" clip-rule="evenodd" />
                    </svg>
                    <input type="date" value="${todayStr}" class="text-sm task-date-input flex-1 outline-none text-[#7A7F83] cursor-pointer">
                </div>
                
                <div class="flex ml-9 gap-2 mt-2">
                    <button type="submit" class="save-task-btn px-4 py-2 bg-[#FF5F26] text-white rounded-full text-sm hover:bg-[#e54f20] transition-colors font-medium">
                        Simpan Tugas
                    </button>
                    <button type="button" class="cancel-task-btn px-4 py-2 border border-[#CCCED2] text-[#7A7F83] rounded-full text-sm hover:bg-gray-50 transition-colors">
                        Batal
                    </button>
                </div>
            </form>
        `;

    $(".tasks-container").prepend(createTaskHTML);
    $(".task-name-input").focus();

    $(".create-task-form").on("submit", function (e) {
      e.preventDefault();
      saveNewTask();
    });

    $(".cancel-task-btn").click(function (e) {
      e.preventDefault();
      cancelCreateTask();
    });

    $(".task-name-input").keypress(function (e) {
      if (e.which === 13) {
        saveNewTask();
      }
    });

    $(document).keyup(function (e) {
      if (e.key === "Escape") {
        cancelCreateTask();
      }
    });
  }

  // Fungsi untuk menyimpan tugas baru
  function saveNewTask() {
    const taskName = $(".task-name-input").val().trim();
    const taskDesc = $(".task-desc-input").val().trim();
    const taskDate = $(".task-date-input").val();

    if (!taskName) {
      $(".task-name-input").addClass("animate-pulse border-red-500");
      setTimeout(() => {
        $(".task-name-input").removeClass("animate-pulse border-red-500");
      }, 1000);
      $(".task-name-input").focus();
      return;
    }

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
        timeTag = `${selectedDate.toLocaleDateString(
          "id-ID",
          options
        )}, ${currentTime}`;
      }
    } else {
      selectedTaskDate = now.toISOString().split("T")[0];
      timeTag = `Hari Ini, ${currentTime}`;
    }

    const createdTimestamp = new Date().toISOString();

    const newTaskHTML = `
            <div class="task-item flex flex-col gap-2 new-task" data-created="${createdTimestamp}" data-date="${selectedTaskDate}" data-time="${currentTime}">
                <div class="flex justify-between items-start">
                    <div class="flex flex-col md:flex-row gap-4 items-start flex-1">
                        <div class="flex gap-4 items-center">
                            <label class="cursor-pointer relative">
                                <input type="checkbox" id="task-${taskCounter}" class="hidden task-checkbox" />
                                <div class="checkbox-custom w-7 h-7 bg-white border border-[#CCCED2] rounded-full flex items-center justify-center transition-all duration-200">
                                    <svg class="checkmark w-6 h-6 text-white opacity-0 transition-opacity duration-200" fill="currentColor" viewBox="0 0 20 20">
                                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                                    </svg>
                                </div>
                            </label>
                            <label for="task-${taskCounter}" class="task-label text-[#293038] text-lg cursor-pointer">${taskName}</label>
                        </div>
                        <div class="flex items-center gap-4">
                            <span class="px-3 py-2 bg-[#FFEBD3] rounded-full text-[#FF5F26] text-sm">${timeTag}</span>
                            <button class="more-vertical-btn relative">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                    <g class="more-vertical-outline">
                                        <path fill="#7A7F83" d="M12 6a2 2 0 1 1 0-4a2 2 0 0 1 0 4m0 8a2 2 0 1 1 0-4a2 2 0 0 1 0 4m0 8a2 2 0 1 1 0-4a2 2 0 0 1 0 4" class="Vector" />
                                    </g>
                                </svg>
                            </button>
                        </div>
                    </div>
                    <button class="task-options p-2 hover:bg-gray-100 rounded transition-colors ml-2">
                        <svg width="12" height="10" viewBox="0 0 12 10" fill="none" class="transform rotate-0 transition-transform duration-200">
                            <path d="M6 10L0 0h12L6 10z" fill="#7A7F83" />
                        </svg>
                    </button>
                </div>
                ${
                  taskDesc
                    ? `<p class="text-[#7A7F83] text-sm mt-1">${taskDesc}</p>`
                    : ""
                }
                
                <div class="subtask-section flex-col bg-[#F5F5F5] w-full p-[16px] gap-3 rounded-md" style="display: none;">
                    <div class="flex gap-2 items-center justify-between">
                        <p class="text-[#293038] font-medium">Subtask</p>
                        
                       <button class="add-subtask-btn flex items-center gap-2 px-4 py-2 bg-white text-[#FF5F26] font-medium rounded-full border border-gray-300 ">
<div class="bg-[#FF5F26] p-0.5 rounded-md flex items-center justify-center">
<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24">
  <path fill="#fff" d="M19 12.998h-6v6h-2v-6H5v-2h6v-6h2v6h6z"/>
</svg>
</div>
Tambah
</button>

                    </div>
                    <div class="subtask-list flex flex-col gap-3">
                        <div class="flex gap-4 items-center subtask-item">
                            <label class="cursor-pointer relative">
                                <input type="checkbox" class="hidden subtask-checkbox" />
                                <div class="checkbox-custom w-7 h-7 bg-white border border-[#CCCED2] rounded-full flex items-center justify-center transition-all duration-200">
                                    <svg class="checkmark w-6 h-6 text-white opacity-0 transition-opacity duration-200" fill="currentColor" viewBox="0 0 20 20">
                                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                                    </svg>
                                </div>
                            </label>
                            <input type="text" placeholder="Masukan nama Subtask" class="subtask-name-input flex-1 outline-none text-[#293038]">
                            <button class="delete-subtask-btn hover:bg-gray-200 p-1 rounded transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
                                    <path fill="#FF5F26" d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6zM19 4h-3.5l-1-1h-5l-1 1H5v2h14z"/>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

    $(".create-task-form").remove();
    $(".tasks-container").append(newTaskHTML);

    $(".new-task")
      .hide()
      .fadeIn(300, function () {
        $(this).removeClass("new-task");
      });

    setTimeout(() => {
      sortTasks(currentSort);
    }, 400);

    taskCounter++;
    isCreating = false;
  }

  // Fungsi untuk membatalkan pembuatan tugas
  function cancelCreateTask() {
    $(".create-task-form").fadeOut(200, function () {
      $(this).remove();
      isCreating = false;
    });

    $(document).off("keyup");
  }

  // Fungsi untuk memindahkan task ke completed section
  function moveToCompleted(taskElement) {
    const taskClone = taskElement.clone();

    $("#completed-tasks").append(taskClone);

    taskElement.fadeOut(300, function () {
      $(this).remove();
      updateCompletedCount();
    });

    if ($("#completed-tasks").hasClass("hidden")) {
      $("#completed-tasks").removeClass("hidden").hide().slideDown(300);
      $("#completed-arrow").removeClass("-rotate-90").addClass("rotate-0");
    }
  }

  // Fungsi untuk memindahkan task kembali ke active section
  function moveToActive(taskElement) {
    const taskClone = taskElement.clone();

    $(".tasks-container").append(taskClone);

    taskClone.hide().fadeIn(300);

    setTimeout(() => {
      sortTasks(currentSort);
    }, 400);

    taskElement.fadeOut(200, function () {
      $(this).remove();
      updateCompletedCount();

      if ($("#completed-tasks").children().length === 0) {
        $("#completed-tasks").slideUp(300, function () {
          $(this).addClass("hidden");
        });
        $("#completed-arrow").removeClass("rotate-0").addClass("-rotate-90");
      }
    });
  }

  // Fungsi untuk update completed count
  function updateCompletedCount() {
    const completedCount = $("#completed-tasks").children().length;
    $("#completed-count").text(completedCount);
  }

  $("#completed-toggle").click(function () {
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
});
