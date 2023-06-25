/** @template {import('lit-element').LitElement} Ctx */
export const propsToCssVar = (
	/** @type {Ctx} */ ctx,
	/** @type {(k: (typeof keys)[number]) => boolean} */ filter,
	/**
	 * @type {Parameters<
	 * 	import('lit-element').PropertyValues<Ctx>['has']
	 * >[0][]}
	 */ keys,
) => {
	for (const k of keys)
		if (filter(k))
			ctx.style.setProperty(
				`--${k.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()}`,
				String(ctx[k]),
			);
};
