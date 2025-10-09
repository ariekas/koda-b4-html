// TaskManager.js - Main Module
import { SortManager } from './modules/SortManager.js';
import { TaskCRUD } from './modules/TaskCRUD.js';
import { SubtaskManager } from './modules/SubtaskManager.js';
import { CheckboxHandler } from './modules/CheckboxHandler.js';
import { UIController } from './modules/UIController.js';
import { TaskMovement } from './modules/TaskMovement.js';

class TaskManager {
  constructor() {
    this.taskCounter = 1;
    this.isCreating = false;
    this.currentSort = "date";
    
    this.initModules();
    this.init();
  }

  initModules() {
    this.sortManager = new SortManager(this);
    this.taskCRUD = new TaskCRUD(this);
    this.subtaskManager = new SubtaskManager(this);
    this.checkboxHandler = new CheckboxHandler(this);
    this.uiController = new UIController(this);
    this.taskMovement = new TaskMovement(this);
  }

  init() {
    this.sortManager.init();
    this.taskCRUD.init();
    this.subtaskManager.init();
    this.checkboxHandler.init();
    this.uiController.init();
  }

  incrementTaskCounter() {
    return this.taskCounter++;
  }

  setCreating(value) {
    this.isCreating = value;
  }

  getCreating() {
    return this.isCreating;
  }

  getCurrentSort() {
    return this.currentSort;
  }

  setCurrentSort(value) {
    this.currentSort = value;
  }
}

$(document).ready(() => {
  window.taskManager = new TaskManager();
});