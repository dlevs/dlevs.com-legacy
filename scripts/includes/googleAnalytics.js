// @flow

import instantclick from './vendor/instantclick';
import type { ErrorEvent } from '../../lib/types';

type GaGalleryEvent = {
	event_category: string,
	event_label: string,
	title: string,
	index: number,
};

type GaGalleryEventPartial = {
	title: string,
	index: number,
};

type GaSocialEvent = {
	event_action: string,
	content_id: string,
	content_type: string,
	method: string,
	title: string,
};

type GaSocialEventPartial = {
	content_type: string,
	method: string,
	title: string,
};

type GaExceptionEvent = {
	description: string,
	file: string,
};

const {
	GOOGLE_ANALYTICS_ID,
	BASE_CONFIG,
	gtag,
} = window;

export const trackPageView = (): void => {
	const { pathname, search } = document.location;

	gtag('config', GOOGLE_ANALYTICS_ID, {
		...BASE_CONFIG,
		page_path: pathname + search,
	});
};

export const trackException = ({
	message,
	filename,
	lineno,
	colno,
}: ErrorEvent): void => {
	const params: GaExceptionEvent = {
		description: message,
		file: `${filename} ${lineno}:${colno}`,
	};

	gtag('event', 'exception', params);
};

const trackGalleryEvent = ({ title, index, event_label }): void => {
	const params: GaGalleryEvent = {
		event_category: 'engagement',
		title,
		index,
		event_label,
	};
	gtag('event', 'gallery_view', params);
};

export const trackGalleryOpen = (data: GaGalleryEventPartial): void => {
	trackGalleryEvent({ ...data, event_label: 'open' });
};

export const trackGalleryNavigation = (data: GaGalleryEventPartial): void => {
	trackGalleryEvent({ ...data, event_label: 'navigation' });
};

export const trackShare = ({ content_type, method, title }: GaSocialEventPartial): void => {
	const { pathname, search, hash } = document.location;
	const params: GaSocialEvent = {
		content_id: pathname + search + hash,
		event_action: 'share_url',
		content_type,
		method,
		title,
	};

	gtag('event', 'share', params);
};

const init = (): void => {
	window.addEventListener('error', trackException);
	instantclick.on('change', (isInitialLoad) => {
		if (!isInitialLoad) {
			trackPageView();
		}
	});
};

export default init;
