export function getClientLang(): string {
	if (typeof Intl !== 'undefined') {
		try {
			return Intl.NumberFormat().resolvedOptions().locale;
		} catch (_err) {
			if (window.navigator.languages) {
				return window.navigator.languages[0];
			} else {
				// @ts-ignore
				return window.navigator.userLanguage || window.navigator.language;
			}
		}
	}

	return 'en-US';
}

export function getDayPeriod(date: Date): string {
	return new Intl.DateTimeFormat(getClientLang(), { dayPeriod: 'short' }).format(date);
}

export function getDateTime(date: Date): string {
	return new Intl.DateTimeFormat(getClientLang(), {
		day: '2-digit',
		month: '2-digit',
		year: '2-digit',
		hour: '2-digit',
		minute: '2-digit',
	}).format(date);
}
