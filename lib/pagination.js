exports.getPaginatedItemsFromCtx = (items, ctx, itemsPerPage = 5) => {
	const page = Number(ctx.query.page || 1);
	const offset = (page - 1) * itemsPerPage;
	const paginatedItems = items.slice(offset, offset + itemsPerPage);
	const totalPages = Math.ceil(items.length / itemsPerPage);

	return {
		data: paginatedItems,
		meta: {
			page,
			itemsPerPage,
			totalItems: items.length,
			totalPages,
			rootPath: ctx.path,
			outOfBounds: page > totalPages
		}
	};
};
