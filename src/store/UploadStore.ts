import { create } from 'zustand';
import { toast } from 'react-hot-toast';
import { API_BASE_URL } from "../../config";


export interface UploadState {
  isUploading: boolean;
  files: string[];
}

interface UploadStore {
  uploads: Record<number, UploadState>;
  startUpload: (caseId: number, files: File[], user?: any) => Promise<void>;
  getCaseUploadStatus: (caseId: number) => UploadState;
}

export const useUploadStore = create<UploadStore>((set, get) => ({
  uploads: {},

  startUpload: async (caseId, files, user) => {
    if (!files || files.length === 0) {
      toast.error('No files selected');
      return;
    }

    set((state) => ({
      uploads: {
        ...state.uploads,
        [caseId]: { isUploading: true, files: files.map((f) => f.name) },
      },
    }));

    try {
      const uploadPromises = files.map(async (file) => {
        const formData = new FormData();
        formData.append('file', file);

        try {
          const res = await fetch(`${API_BASE_URL}/cases/${caseId}/documents`, {
            method: 'POST',
            body: formData,
            headers: {
              Authorization: `Bearer todoToken`,
              'user-id': user?.displayName || user?.email || '',
            },
          });

          if (!res.ok) {
            const msg = await res.text();
            throw new Error(msg || `HTTP ${res.status}`);
          }

          toast.success(`${file.name} uploaded successfully`);
          return { status: 'fulfilled', file: file.name };
        } catch (err: any) {
          toast.error(`${file.name} failed: ${err.message}`);
          return { status: 'rejected', file: file.name, error: err.message };
        }
      });

      // Run all uploads concurrently
      const results = await Promise.all(uploadPromises);
      const successCount = results.filter((r) => r.status === 'fulfilled').length;
      const failCount = results.length - successCount;

      if (successCount > 0)
        toast.success(`${successCount} file(s) uploaded successfully`);
      if (failCount > 0)
        toast.error(`${failCount} file(s) failed to upload`);
    } finally {
      // Mark upload complete
      set((state) => ({
        uploads: {
          ...state.uploads,
          [caseId]: { isUploading: false, files: [] },
        },
      }));
    }
  },

  getCaseUploadStatus: (caseId) =>
    get().uploads[caseId] || { isUploading: false, files: [] },
}));
