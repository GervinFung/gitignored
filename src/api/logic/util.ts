const oneWeekComparison = (time: Date) => {
	const oneWeek = new Date().getTime() + 1 * 24 * 60 * 60 * 1000 * 7;

	const largerOrEqual = time.getTime() >= oneWeek;

	if (largerOrEqual) {
		return {
			status: 'larget-or-equal',
		} as const;
	}

	return {
		status: 'smaller',
	} as const;
};

export { oneWeekComparison };
