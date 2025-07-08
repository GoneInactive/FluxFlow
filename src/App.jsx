import React, { useState, useEffect } from 'react';
import { Plus, X, Edit3, Trash2, Settings, Circle, CheckCircle2, Clock, Zap, Target, Home, Briefcase, Heart, User, Save, ArrowLeft, Filter } from 'lucide-react';

const FluxFlow = () => {
  const [tasks, setTasks] = useState([]);
  const [statusCategories, setStatusCategories] = useState([
    { id: 1, name: 'Ready', color: 'blue', icon: Circle },
    { id: 2, name: 'Working', color: 'orange', icon: Zap },
    { id: 3, name: 'Review', color: 'purple', icon: Clock },
    { id: 4, name: 'Complete', color: 'green', icon: CheckCircle2 }
  ]);
  const [projectCategories, setProjectCategories] = useState([
    { id: 1, name: 'Work', color: 'indigo', icon: Briefcase },
    { id: 2, name: 'Personal', color: 'pink', icon: Heart },
    { id: 3, name: 'Home', color: 'emerald', icon: Home },
    { id: 4, name: 'Learning', color: 'amber', icon: Target }
  ]);
  
  const [showAddTask, setShowAddTask] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    statusId: 1,
    projectId: 1,
    priority: 'medium'
  });

  // Filter states
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterProject, setFilterProject] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');

  const [settingsTab, setSettingsTab] = useState('status');
  const [editingCategory, setEditingCategory] = useState(null);
  const [newCategory, setNewCategory] = useState({ name: '', color: 'blue' });

  const colorOptions = [
    'blue', 'green', 'purple', 'orange', 'pink', 'indigo', 
    'emerald', 'amber', 'red', 'teal', 'cyan', 'lime'
  ];

  const iconOptions = [Circle, CheckCircle2, Clock, Zap, Target, Home, Briefcase, Heart, User];

  // Filter tasks based on selected filters
  const filteredTasks = tasks.filter(task => {
    const statusMatch = filterStatus === 'all' || task.statusId === parseInt(filterStatus);
    const projectMatch = filterProject === 'all' || task.projectId === parseInt(filterProject);
    const priorityMatch = filterPriority === 'all' || task.priority === filterPriority;
    
    return statusMatch && projectMatch && priorityMatch;
  });

  const clearFilters = () => {
    setFilterStatus('all');
    setFilterProject('all');
    setFilterPriority('all');
  };

  const hasActiveFilters = filterStatus !== 'all' || filterProject !== 'all' || filterPriority !== 'all';

  const addTask = () => {
    const task = {
      id: Date.now(),
      ...newTask,
      createdAt: new Date().toISOString()
    };
    setTasks([...tasks, task]);
    setNewTask({ title: '', description: '', statusId: 1, projectId: 1, priority: 'medium' });
    setShowAddTask(false);
  };

  const updateTask = () => {
    setTasks(tasks.map(task => 
      task.id === editingTask.id ? { ...editingTask } : task
    ));
    setEditingTask(null);
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const addCategory = (type) => {
    const category = {
      id: Date.now(),
      ...newCategory,
      icon: Circle
    };
    
    if (type === 'status') {
      setStatusCategories([...statusCategories, category]);
    } else {
      setProjectCategories([...projectCategories, category]);
    }
    
    setNewCategory({ name: '', color: 'blue' });
  };

  const updateCategory = (type, updatedCategory) => {
    if (type === 'status') {
      setStatusCategories(statusCategories.map(cat => 
        cat.id === updatedCategory.id ? updatedCategory : cat
      ));
    } else {
      setProjectCategories(projectCategories.map(cat => 
        cat.id === updatedCategory.id ? updatedCategory : cat
      ));
    }
    setEditingCategory(null);
  };

  const deleteCategory = (type, id) => {
    if (type === 'status') {
      setStatusCategories(statusCategories.filter(cat => cat.id !== id));
    } else {
      setProjectCategories(projectCategories.filter(cat => cat.id !== id));
    }
  };

  const getStatusById = (id) => statusCategories.find(s => s.id === id);
  const getProjectById = (id) => projectCategories.find(p => p.id === id);

  if (showSettings) {
    return (
      <div className="app-container">
        <div className="settings-container">
          <div className="settings-card">
            <div className="settings-header">
              <div className="settings-title-section">
                <button 
                  onClick={() => setShowSettings(false)}
                  className="back-button"
                >
                  <ArrowLeft className="icon-sm" />
                </button>
                <Settings className="icon-md settings-icon" />
                <h1 className="settings-title">FluxFlow Settings</h1>
              </div>
            </div>

            <div className="settings-tabs">
              <button
                onClick={() => setSettingsTab('status')}
                className={`tab-button ${settingsTab === 'status' ? 'tab-active' : 'tab-inactive'}`}
              >
                Status Categories
              </button>
              <button
                onClick={() => setSettingsTab('project')}
                className={`tab-button ${settingsTab === 'project' ? 'tab-active' : 'tab-inactive'}`}
              >
                Project Categories
              </button>
            </div>

            <div className="settings-content">
              <div className="add-category-section">
                <h3 className="section-title">
                  Add New {settingsTab === 'status' ? 'Status' : 'Project'} Category
                </h3>
                <div className="add-category-form">
                  <input
                    type="text"
                    placeholder="Category name"
                    value={newCategory.name}
                    onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                    className="input-field flex-1"
                  />
                  <select
                    value={newCategory.color}
                    onChange={(e) => setNewCategory({ ...newCategory, color: e.target.value })}
                    className="select-field"
                  >
                    {colorOptions.map(color => (
                      <option key={color} value={color}>
                        {color}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() => addCategory(settingsTab)}
                    disabled={!newCategory.name}
                    className="add-button"
                  >
                    <Plus className="icon-sm" />
                  </button>
                </div>
              </div>

              <div className="category-list">
                {(settingsTab === 'status' ? statusCategories : projectCategories).map(category => (
                  <div key={category.id} className="category-item">
                    <div className="category-info">
                      <div className={`color-indicator color-${category.color}`}></div>
                      <span className="category-name">{category.name}</span>
                    </div>
                    <div className="category-actions">
                      <button
                        onClick={() => setEditingCategory({ ...category, type: settingsTab })}
                        className="action-button"
                      >
                        <Edit3 className="icon-xs" />
                      </button>
                      <button
                        onClick={() => deleteCategory(settingsTab, category.id)}
                        className="action-button delete-button"
                      >
                        <Trash2 className="icon-xs" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {editingCategory && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h3 className="modal-title">Edit Category</h3>
              <div className="modal-form">
                <input
                  type="text"
                  value={editingCategory.name}
                  onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                  className="input-field"
                />
                <select
                  value={editingCategory.color}
                  onChange={(e) => setEditingCategory({ ...editingCategory, color: e.target.value })}
                  className="select-field"
                >
                  {colorOptions.map(color => (
                    <option key={color} value={color}>
                      {color}
                    </option>
                  ))}
                </select>
                <div className="modal-actions">
                  <button
                    onClick={() => updateCategory(editingCategory.type, editingCategory)}
                    className="primary-button"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingCategory(null)}
                    className="secondary-button"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="app-container">
      <div className="main-container">
        <div className="header-card">
          <div className="header-content">
            <div className="header-title-section">
              <div className="logo">
                <Zap className="logo-icon" />
              </div>
              <div className="title-text">
                <h1 className="main-title">FluxFlow</h1>
                <p className="subtitle">Your dynamic task orchestrator</p>
              </div>
            </div>
            <div className="header-actions">
              <button
                onClick={() => setShowFilter(!showFilter)}
                className={`secondary-button ${hasActiveFilters ? 'settings-button' : ''}`}
              >
                <Filter className="icon-sm" />
                {hasActiveFilters && <span>Filtered</span>}
              </button>
              <button
                onClick={() => setShowAddTask(true)}
                className="primary-button add-task-button"
              >
                <Plus className="icon-sm" />
                <span>Add Task</span>
              </button>
              <button
                onClick={() => setShowSettings(true)}
                className="secondary-button settings-button"
              >
                <Settings className="icon-sm" />
              </button>
            </div>
          </div>
        </div>

        {showFilter && (
          <div className="header-card">
            <div className="header-content">
              <div className="form-grid">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="select-field"
                >
                  <option value="all">All Statuses</option>
                  {statusCategories.map(status => (
                    <option key={status.id} value={status.id}>{status.name}</option>
                  ))}
                </select>
                <select
                  value={filterProject}
                  onChange={(e) => setFilterProject(e.target.value)}
                  className="select-field"
                >
                  <option value="all">All Projects</option>
                  {projectCategories.map(project => (
                    <option key={project.id} value={project.id}>{project.name}</option>
                  ))}
                </select>
                <select
                  value={filterPriority}
                  onChange={(e) => setFilterPriority(e.target.value)}
                  className="select-field"
                >
                  <option value="all">All Priorities</option>
                  <option value="low">Low Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="high">High Priority</option>
                </select>
                <button
                  onClick={clearFilters}
                  className="secondary-button"
                  disabled={!hasActiveFilters}
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="task-grid">
          {filteredTasks.map(task => {
            const status = getStatusById(task.statusId);
            const project = getProjectById(task.projectId);
            const StatusIcon = status?.icon || Circle;
            const ProjectIcon = project?.icon || Briefcase;

            return (
              <div
                key={task.id}
                className={`task-card priority-${task.priority}`}
              >
                <div className="task-header">
                  <h3 className="task-title">{task.title}</h3>
                  <div className="task-actions">
                    <button
                      onClick={() => setEditingTask(task)}
                      className="action-button"
                    >
                      <Edit3 className="icon-xs" />
                    </button>
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="action-button delete-button"
                    >
                      <Trash2 className="icon-xs" />
                    </button>
                  </div>
                </div>
                
                {task.description && (
                  <p className="task-description">{task.description}</p>
                )}
                
                <div className="task-footer">
                  <div className="task-badges">
                    <div className={`badge badge-${status?.color}`}>
                      <StatusIcon className="icon-xs" />
                      <span>{status?.name}</span>
                    </div>
                    <div className={`badge badge-${project?.color}`}>
                      <ProjectIcon className="icon-xs" />
                      <span>{project?.name}</span>
                    </div>
                  </div>
                  <div className={`priority-indicator priority-${task.priority}`}>
                    {task.priority}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredTasks.length === 0 && tasks.length > 0 && (
          <div className="empty-state">
            <div className="empty-icon">
              <Filter className="icon-lg" />
            </div>
            <h3 className="empty-title">No tasks match your filters</h3>
            <p className="empty-description">Try adjusting your filter settings to see more tasks</p>
          </div>
        )}

        {tasks.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">
              <Target className="icon-lg" />
            </div>
            <h3 className="empty-title">No tasks yet</h3>
            <p className="empty-description">Create your first task to get started with FluxFlow</p>
          </div>
        )}
      </div>

      {(showAddTask || editingTask) && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 className="modal-title">
              {editingTask ? 'Edit Task' : 'Add New Task'}
            </h3>
            <div className="modal-form">
              <input
                type="text"
                placeholder="Task title"
                value={editingTask ? editingTask.title : newTask.title}
                onChange={(e) => {
                  if (editingTask) {
                    setEditingTask({ ...editingTask, title: e.target.value });
                  } else {
                    setNewTask({ ...newTask, title: e.target.value });
                  }
                }}
                className="input-field"
              />
              <textarea
                placeholder="Task description"
                value={editingTask ? editingTask.description : newTask.description}
                onChange={(e) => {
                  if (editingTask) {
                    setEditingTask({ ...editingTask, description: e.target.value });
                  } else {
                    setNewTask({ ...newTask, description: e.target.value });
                  }
                }}
                rows={3}
                className="textarea-field"
              />
              <div className="form-grid">
                <select
                  value={editingTask ? editingTask.statusId : newTask.statusId}
                  onChange={(e) => {
                    if (editingTask) {
                      setEditingTask({ ...editingTask, statusId: parseInt(e.target.value) });
                    } else {
                      setNewTask({ ...newTask, statusId: parseInt(e.target.value) });
                    }
                  }}
                  className="select-field"
                >
                  {statusCategories.map(status => (
                    <option key={status.id} value={status.id}>{status.name}</option>
                  ))}
                </select>
                <select
                  value={editingTask ? editingTask.projectId : newTask.projectId}
                  onChange={(e) => {
                    if (editingTask) {
                      setEditingTask({ ...editingTask, projectId: parseInt(e.target.value) });
                    } else {
                      setNewTask({ ...newTask, projectId: parseInt(e.target.value) });
                    }
                  }}
                  className="select-field"
                >
                  {projectCategories.map(project => (
                    <option key={project.id} value={project.id}>{project.name}</option>
                  ))}
                </select>
              </div>
              <select
                value={editingTask ? editingTask.priority : newTask.priority}
                onChange={(e) => {
                  if (editingTask) {
                    setEditingTask({ ...editingTask, priority: e.target.value });
                  } else {
                    setNewTask({ ...newTask, priority: e.target.value });
                  }
                }}
                className="select-field"
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
              </select>
              <div className="modal-actions">
                <button
                  onClick={editingTask ? updateTask : addTask}
                  disabled={!(editingTask ? editingTask.title : newTask.title)}
                  className="primary-button"
                >
                  {editingTask ? 'Update' : 'Add'} Task
                </button>
                <button
                  onClick={() => {
                    setShowAddTask(false);
                    setEditingTask(null);
                    setNewTask({ title: '', description: '', statusId: 1, projectId: 1, priority: 'medium' });
                  }}
                  className="secondary-button"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FluxFlow;