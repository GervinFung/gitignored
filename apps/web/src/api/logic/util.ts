const isMoreThanOrEqualOneWeek = (time: Date) => {
	const now = new Date();

	const diff = now.getTime() - time.getTime();

	const week = 7 * 24 * 60 * 60 * 1000;

	return diff >= week;
};

const isTimeEqual = (time1: Date, time2: Date) => {
	return time1.getTime() === time2.getTime();
};

export { isMoreThanOrEqualOneWeek, isTimeEqual };
