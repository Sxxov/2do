export const whenResize = (
	/** @type {HTMLElement} */ node,
	/** @type {(rect: { width: number; height: number }) => void} */ callback,
) => {
	const observer = new ResizeObserver((entries) => {
		for (const { contentBoxSize } of entries)
			if (contentBoxSize.length > 0)
				callback({
					width: /** @type {ResizeObserverSize} */ (contentBoxSize[0])
						.inlineSize,
					height: /** @type {ResizeObserverSize} */ (
						contentBoxSize[0]
					).blockSize,
				});
	});

	observer.observe(node);

	return {
		destroy() {
			observer.disconnect();
		},
	};
};
