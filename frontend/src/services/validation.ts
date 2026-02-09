export class ValidationService {
  static validateTaskTitle(title: string): { isValid: boolean; error?: string } {
    if (!title || title.trim().length === 0) {
      return { isValid: false, error: 'Title is required' };
    }
    
    if (title.length > 255) {
      return { isValid: false, error: 'Title must be 255 characters or less' };
    }
    
    return { isValid: true };
  }

  static validateTaskDescription(description: string | null): { isValid: boolean; error?: string } {
    if (description && description.length > 1000) {
      return { isValid: false, error: 'Description must be 1000 characters or less' };
    }
    
    return { isValid: true };
  }

  static validateTask(task: { title: string; description?: string | null }): { isValid: boolean; errors: Record<string, string> } {
    const titleValidation = this.validateTaskTitle(task.title);
    const descriptionValidation = this.validateTaskDescription(task.description || null);

    const errors: Record<string, string> = {};
    
    if (!titleValidation.isValid) {
      errors.title = titleValidation.error!;
    }
    
    if (!descriptionValidation.isValid) {
      errors.description = descriptionValidation.error!;
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }

  static validateScheduledDate(date: Date | null): { isValid: boolean; error?: string } {
    if (date && isNaN(date.getTime())) {
      return { isValid: false, error: 'Invalid date provided' };
    }
    
    return { isValid: true };
  }
}