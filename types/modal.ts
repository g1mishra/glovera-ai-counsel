export interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface AddProgramModalProps extends BaseModalProps {
  isAddModalOpen: boolean;
  onCloseAddModal: () => void;
}

export interface BulkUploadModalProps extends BaseModalProps {
  isBulkModalOpen: boolean;
  onCloseBulkModal: () => void;
}

export interface FormData {
  program_name: string;
  degree_type: string;
  duration: string;
  program_start_date: string;
  tuition_fee: string;
  eligibility_criteria: {
    minimum_gpa: string;
    language_proficiency: string;
    subjects_required: string[];
    technical_skills: string[];
  };
}
