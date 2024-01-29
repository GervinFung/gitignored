const changeWordToUrl = (word: string) => {
	return word.replace(' ', '-').toLowerCase();
};

export { changeWordToUrl };
