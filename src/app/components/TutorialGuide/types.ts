export interface TutorialStep {
  id: number;
  title: string;
  description: string;
  targetElement: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  icon?: string;
}

export interface TutorialState {
  isActive: boolean;
  currentStep: number;
  isCompleted: boolean;
  showStartPanel: boolean;
}