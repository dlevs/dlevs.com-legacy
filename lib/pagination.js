exports.getPaginatedItemsFromCtx = (items, ctx, itemsPerPage = 10) => {
	const page = Number(ctx.query.page || 1);
	const offset = (page - 1) * itemsPerPage;
	const paginatedItems = items.slice(offset, offset + itemsPerPage);

	return {
		page,
		itemsPerPage,
		totalItems: items.length,
		totalPages: Math.ceil(items.length / itemsPerPage),
		data: paginatedItems,
		rootPath: ctx.path
	};
};
