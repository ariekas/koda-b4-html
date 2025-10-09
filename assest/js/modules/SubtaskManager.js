export class SubtaskManager {
  constructor(taskManager) {
    this.taskManager = taskManager;
  }

  init() {
    this.setupAddSubtask();
    this.setupDeleteSubtask();
  }

  setupAddSubtask() {
    $(document).on("click", ".add-subtask-btn", (e) => {
      e.preventDefault();

      const subtaskList = $(e.currentTarget)
        .closest(".subtask-section")
        .find(".subtask-list");

      const newSubtaskHTML = this.buildSubtaskItem();
      subtaskList.append(newSubtaskHTML);
      subtaskList.find(".subtask-item:last .subtask-name-input").focus();
    });
  }

  setupDeleteSubtask() {
    $(document).on("click", ".delete-subtask-btn", (e) => {
      e.preventDefault();

      $(e.currentTarget).closest(".subtask-item").fadeOut(200, function () {
        $(this).remove();
      });
    });
  }

  buildSubtaskItem() {
    return `
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
  }
}