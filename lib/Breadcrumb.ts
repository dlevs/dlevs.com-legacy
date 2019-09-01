interface BreadCrumbItemSource {
	slug: string;
	name: string;
}

/**
 * Takes an array of objects with a slug property, and adds
 * the cumulative URL path to each object.
 */
const expandBreadcrumb = (breadcrumb: BreadCrumbItemSource[]) => {
	const currentSlugs: string[] = [];

	return breadcrumb.map(({ slug, ...otherProps }) => {
		currentSlugs.push(slug);

		return {
			...otherProps,
			slug,
			path: currentSlugs.join('/') || '/',
		};
	});
};

class Breadcrumb {
	partsRaw: BreadCrumbItemSource[];

	constructor(parts: BreadCrumbItemSource[]) {
		this.partsRaw = expandBreadcrumb(parts);
	}

	append(parts: BreadCrumbItemSource | BreadCrumbItemSource[]) {
		return new Breadcrumb(this.partsRaw.concat(parts));
	}

	get parts() {
		return expandBreadcrumb(this.partsRaw);
	}

	get currentPage() {
		return this.parts[this.parts.length - 1];
	}

	get path() {
		return this.currentPage.path;
	}
}

export default Breadcrumb;
