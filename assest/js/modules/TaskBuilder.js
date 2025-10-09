export class TaskBuilder {
  constructor(taskManager) {
    this.taskManager = taskManager;
  }

  buildCreateForm(todayStr) {
    return `
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
          <label for="task-name" class="hidden">Nama Tugas</label>
          <input type="text" placeholder="Masukan nama tugas" id="task-name" class="task-input-editing task-name-input flex-1 outline-none text-lg" required>
        </div>
        
        <div class="flex ml-9 gap-2 w-full">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24">
            <path fill="none" stroke="#7A7F83" stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M4 6h16M4 12h16M4 18h7" />
          </svg>
          <label for="deskripsi-task" class="hidden">Deskripsi</label>
          <input type="text" id="deskripsi-task" placeholder="Deskripsi Tugas (Optional)" class="text-sm task-desc-input flex-1 outline-none text-[#7A7F83]">
        </div>
        
        <div class="flex ml-9 gap-2 w-full">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24">
            <path fill="#7A7F83" d="M8.5 14a1.25 1.25 0 1 0 0-2.5a1.25 1.25 0 0 0 0 2.5m0 3.5a1.25 1.25 0 1 0 0-2.5a1.25 1.25 0 0 0 0 2.5m4.75-4.75a1.25 1.25 0 1 1-2.5 0a1.25 1.25 0 0 1 2.5 0M12 17.5a1.25 1.25 0 1 0 0-2.5a1.25 1.25 0 0 0 0 2.5m4.75-4.75a1.25 1.25 0 1 1-2.5 0a1.25 1.25 0 0 1 2.5 0" />
            <path fill="#7A7F83" fill-rule="evenodd" d="M8 3.25a.75.75 0 0 1 .75.75v.75h6.5V4a.75.75 0 0 1 1.5 0v.758q.228.006.425.022c.38.03.736.098 1.073.27a2.75 2.75 0 0 1 1.202 1.202c.172.337.24.693.27 1.073c.03.365.03.81.03 1.345v7.66c0 .535 0 .98-.03 1.345c-.03.38-.098.736-.27 1.073a2.75 2.75 0 0 1-1.201 1.202c-.338.172-.694.24-1.074.27c-.365.03-.81.03-1.344.03H8.17c-.535 0-.98 0-1.345-.03c-.38-.03-.736-.098-1.073-.27a2.75 2.75 0 0 1-1.202-1.2c-.172-.338-.24-.694-.27-1.074c-.03-.365-.03-.81-.03-1.344V8.67c0-.535 0-.98.03-1.345c.03-.38.098-.736.27-1.073A2.75 2.75 0 0 1 5.752 5.05c.337-.172.693-.24 1.073-.27q.197-.016.425-.022V4A.75.75 0 0 1 8 3.25M7.25 6.5v-.242a6 6 0 0 0-.303.017c-.287.023-.424.065-.514.111a1.25 1.25 0 0 0-.547.547c-.046.09-.088.227-.111.514c-.024.296-.025.68-.025 1.253v.55h12.5V8.7c0-.572 0-.957-.025-1.253c-.023-.287-.065-.424-.111-.514a1.25 1.25 0 0 0-.547-.547c-.09-.046-.227-.088-.515-.111a6 6 0 0 0-.302-.017V6.5a.75.75 0 0 1-1.5 0v-.25h-6.5v.25a.75.75 0 0 1-1.5 0m11 3.75H5.75v6.05c0 .572 0 .957.025 1.252c.023.288.065.425.111.515c.12.236.311.427.547.547c.09.046.227.088.514.111c.296.024.68.025 1.253.025h7.6c.572 0 .957 0 1.252-.025c.288-.023.425-.065.515-.111a1.25 1.25 0 0 0 .547-.547c.046-.09.088-.227.111-.515c.024-.295.025-.68.025-1.252z" clip-rule="evenodd" />
            <path fill="#7A7F83" fill-rule="evenodd" d="M9.75 7.75A.75.75 0 0 1 10.5 7h3a.75.75 0 0 1 0 1.5h-3a.75.75 0 0 1-.75-.75" clip-rule="evenodd" />
          </svg>
          <label for="date-task" class="hidden">Tanggal</label>
          <input type="date" id="date-task" value="${todayStr}" class="text-sm task-date-input flex-1 outline-none text-[#7A7F83] cursor-pointer">
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
  }

  buildTaskItem(taskData, taskId) {
    return `
      <div class="task-item flex flex-col gap-2 new-task" data-created="${taskData.created}" data-date="${taskData.date}" data-time="${taskData.time}">
        <div class="flex justify-between items-start">
          <div class="flex flex-col md:flex-row gap-4 items-start flex-1">
            <div class="flex gap-4 items-center">
              <label class="cursor-pointer relative" for="task-${taskId}">
                <input type="checkbox" id="task-${taskId}" class="hidden task-checkbox" />
                <div class="checkbox-custom w-7 h-7 bg-white border border-[#CCCED2] rounded-full flex items-center justify-center transition-all duration-200">
                  <svg class="checkmark w-6 h-6 text-white opacity-0 transition-opacity duration-200" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                  </svg>
                </div>
              </label>
              <label for="task-${taskId}" class="task-label text-[#293038] text-lg cursor-pointer">${taskData.name}</label>
            </div>
            <div class="flex items-center gap-4">
              <span class="px-3 py-2 bg-[#FFEBD3] rounded-full text-[#FF5F26] text-sm">${taskData.timeTag}</span>
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
        ${taskData.desc ? `<p class="text-[#7A7F83] text-sm mt-1">${taskData.desc}</p>` : ""}
        
        <div class="subtask-section flex-col bg-[#F5F5F5] w-full p-[16px] gap-3 rounded-md" style="display: none;">
          <div class="flex gap-2 items-center justify-between">
            <p class="text-[#293038] font-medium">Subtask</p>
            
            <button class="add-subtask-btn flex items-center gap-2 px-4 py-2 bg-white text-[#FF5F26] font-medium rounded-full border border-gray-300">
              <div class="bg-[#FF5F26] p-0.5 rounded-md flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24">
                  <path fill="#fff" d="M19 12.998h-6v6h-2v-6H5v-2h6v-6h2v6h6z"/>
                </svg>
              </div>
              Tambah
            </button>
          </div>
          <div class="subtask-list flex flex-col gap-3 mt-3">
            <div class="flex gap-4 items-center subtask-item">
              <label class="cursor-pointer relative" for="subtask-${taskId}">
                <input type="checkbox" class="hidden subtask-checkbox" id="subtask-${taskId}"/>
                <div class="checkbox-custom w-7 h-7 bg-white border border-[#CCCED2] rounded-full flex items-center justify-center transition-all duration-200">
                  <svg class="checkmark w-6 h-6 text-white opacity-0 transition-opacity duration-200" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                  </svg>
                </div>
              </label>
              <label for="subtask-name-${taskId}" class="hidden">Subtask</label>
              <input type="text" id="subtask-name-${taskId}" placeholder="Masukan nama Subtask" class="subtask-name-input flex-1 outline-none text-[#293038]">
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
  }

  buildEditButtons() {
    return `
      <div class="edit-buttons flex gap-2 mt-2">
        <button class="save-edit-btn px-4 py-2 bg-[#FF5F26] text-white rounded-full text-sm hover:bg-[#e54f20] transition-colors font-medium">
          Simpan
        </button>
        <button class="cancel-edit-btn px-4 py-2 border border-[#CCCED2] text-[#7A7F83] rounded-full text-sm hover:bg-gray-50 transition-colors">
          Batal
        </button>
      </div>
    `;
  }
}