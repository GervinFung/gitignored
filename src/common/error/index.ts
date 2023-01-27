const processErrorMessage = (error: any) =>
    typeof error === 'string'
        ? error
        : error instanceof Error
        ? error.message
        : JSON.stringify(error);

export { processErrorMessage };
