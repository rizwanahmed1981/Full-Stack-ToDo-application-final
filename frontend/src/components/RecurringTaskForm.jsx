import React, { useState } from 'react';
import axios from 'axios';

const RecurringTaskForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    recurrence_pattern: 'daily',
    recurrence_interval: 1,
    recurrence_end_date: '',
    recurrence_occurrence_count: null,
    recurrence_by_week_day: '',
    recurrence_by_month_day: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Prepare the data for submission
      const requestData = {
        ...formData,
        recurrence_interval: parseInt(formData.recurrence_interval),
        recurrence_occurrence_count: formData.recurrence_occurrence_count 
          ? parseInt(formData.recurrence_occurrence_count) 
          : null,
        recurrence_end_date: formData.recurrence_end_date || null,
        recurrence_by_week_day: formData.recurrence_by_week_day || null,
        recurrence_by_month_day: formData.recurrence_by_month_day || null,
        recurrence_by_set_pos: null  // This field is not commonly used in basic forms
      };
      
      const response = await axios.post('/api/v1/recurring-tasks/', requestData);
      
      if (onSubmit) {
        onSubmit(response.data);
      }
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        priority: 'medium',
        recurrence_pattern: 'daily',
        recurrence_interval: 1,
        recurrence_end_date: '',
        recurrence_occurrence_count: null,
        recurrence_by_week_day: '',
        recurrence_by_month_day: ''
      });
      
      alert('Recurring task created successfully!');
    } catch (error) {
      console.error('Error creating recurring task:', error);
      alert('Error creating recurring task: ' + (error.response?.data?.detail || error.message));
    }
  };

  // NEW: Function to handle individual instance modification
  const handleModifyInstance = async (taskId, modificationData) => {
    try {
      // This would typically call an endpoint to modify a specific instance
      // For now, we'll simulate the API call
      const response = await axios.put(`/api/v1/recurring-tasks/instances/${taskId}/modify`, modificationData);
      
      alert('Task instance modified successfully!');
      return response.data;
    } catch (error) {
      console.error('Error modifying task instance:', error);
      alert('Error modifying task instance: ' + (error.response?.data?.detail || error.message));
      throw error;
    }
  };

  // NEW: Function to handle skipping an individual instance
  const handleSkipInstance = async (taskId) => {
    try {
      // This would typically call an endpoint to skip a specific instance
      const response = await axios.put(`/api/v1/recurring-tasks/instances/${taskId}/skip`);
      
      alert('Task instance skipped successfully!');
      return response.data;
    } catch (error) {
      console.error('Error skipping task instance:', error);
      alert('Error skipping task instance: ' + (error.response?.data?.detail || error.message));
      throw error;
    }
  };

  return (
    <div className="recurring-task-form">
      <h3>Create Recurring Task</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title *</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="priority">Priority</label>
          <select
            id="priority"
            name="priority"
            value={formData.priority}
            onChange={handleChange}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="recurrence_pattern">Recurrence Pattern *</label>
          <select
            id="recurrence_pattern"
            name="recurrence_pattern"
            value={formData.recurrence_pattern}
            onChange={handleChange}
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="recurrence_interval">Interval *</label>
          <input
            type="number"
            id="recurrence_interval"
            name="recurrence_interval"
            value={formData.recurrence_interval}
            onChange={handleChange}
            min="1"
            required
          />
          <small>Repeat every X {formData.recurrence_pattern}</small>
        </div>

        <div className="form-group">
          <label htmlFor="recurrence_end_date">End Date (optional)</label>
          <input
            type="date"
            id="recurrence_end_date"
            name="recurrence_end_date"
            value={formData.recurrence_end_date}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="recurrence_occurrence_count">Max Occurrences (optional)</label>
          <input
            type="number"
            id="recurrence_occurrence_count"
            name="recurrence_occurrence_count"
            value={formData.recurrence_occurrence_count}
            onChange={handleChange}
            min="1"
          />
        </div>

        {formData.recurrence_pattern === 'weekly' && (
          <div className="form-group">
            <label htmlFor="recurrence_by_week_day">Days of Week (comma-separated, e.g., MO,WE,FR)</label>
            <input
              type="text"
              id="recurrence_by_week_day"
              name="recurrence_by_week_day"
              value={formData.recurrence_by_week_day}
              onChange={handleChange}
              placeholder="MO,TU,WE,TH,FR"
            />
          </div>
        )}

        {formData.recurrence_pattern === 'monthly' && (
          <div className="form-group">
            <label htmlFor="recurrence_by_month_day">Day of Month (comma-separated, e.g., 1,15)</label>
            <input
              type="text"
              id="recurrence_by_month_day"
              name="recurrence_by_month_day"
              value={formData.recurrence_by_month_day}
              onChange={handleChange}
              placeholder="1,15"
            />
          </div>
        )}

        <button type="submit">Create Recurring Task</button>
      </form>
      
      {/* NEW: Section for managing individual instances */}
      <div className="instance-management">
        <h4>Manage Individual Instances</h4>
        <div className="form-group">
          <label htmlFor="instanceId">Task Instance ID:</label>
          <input
            type="number"
            id="instanceId"
            placeholder="Enter the ID of the task instance to modify"
          />
        </div>
        <div className="form-group">
          <label htmlFor="instanceAction">Action:</label>
          <select id="instanceAction">
            <option value="modify">Modify Instance</option>
            <option value="skip">Skip Instance</option>
          </select>
        </div>
        <button onClick={() => {
          const instanceId = document.getElementById('instanceId').value;
          const action = document.getElementById('instanceAction').value;
          
          if (action === 'skip' && instanceId) {
            handleSkipInstance(parseInt(instanceId));
          }
          // For modify action, we would need additional fields for the modifications
        }}>
          Perform Action
        </button>
      </div>
    </div>
  );
};

export default RecurringTaskForm;