export type TimeEntry = {
  id: string;
  description: string;
  project: string;
  startDate: Date | null;
  endDate: Date | null;
  duration: string;
};

export type ResultData = {
  settings: {
    workdayStartTime: string;
    workdayEndTime: string;
    workHours: number;
    projects: { key: string; title: string }[];
  };
  user: {
    records: {
      workDate: Date;
      entries: TimeEntry[];
    }[];
  };
};

export type Result = {
  message: string;
  success: boolean;
  data: undefined | ResultData;
};

const result = {
  success: (data: ResultData | undefined): Result => {
    return { data, message: 'success', success: true };
  },
  failed: (message: string) => {
    return { data: undefined, message, success: false };
  },
};

export default result;
