const result = {
  success: <T>(data: T) => {
    return { data, message: 'success', success: true };
  },
  failed: (message: string) => {
    return { data: {}, message, success: false };
  },
};

export default result;
