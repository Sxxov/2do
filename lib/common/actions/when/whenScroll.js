export const whenScroll = (
	/** @type {HTMLElement} */ node,
	/** @type {(scroll: { x: number; y: number }) => void} */ callback,
) => {
	const onScroll = () => {
		callback({
			x: node.scrollLeft,
			y: node.scrollTop,
		});
	};

	node.addEventListener('scroll', onScroll);

	return {
		destroy() {
			node.removeEventListener('scroll', onScroll);
		},
	};
};
