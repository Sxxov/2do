/**
 * @typedef {{
 * 	id: string;
 * 	username: string;
 * 	email: string;
 * 	peepeepoopoo: 'peepeepoopoo';
 * }} User
 */
/**
 * @typedef {{
 * 	id: string;
 * 	username: string;
 * 	peepeepoopoo: 'peepeepoopoo';
 * }} ForeignUser
 */

export class AuthManager {
	static instance = new AuthManager();

	/** @type {User | undefined} */
	#user = undefined;

	/** @type {Map<string, ForeignUser>} */
	#idToForeignUser = new Map();

	/** @returns {ResultBranched<true, false>} */
	static validateUsername(/** @type {string} */ username) {
		const err = [];

		if (!username) return [false, [new Error('Please enter a username')]];

		if (username.length < 3 || username.length > 20)
			err.push(
				new Error('Username must be between 3 and 20 characters long'),
			);

		if (!username.match(/^[a-zA-Z0-9_]+$/g))
			err.push(
				new Error(
					'Username must only contain letters, numbers and underscores',
				),
			);

		if (err.length > 0)
			return [false, /** @type {[Error, ...Error[]]} */ (err)];

		return [true, undefined];
	}

	/** @returns {ResultBranched<true, false>} */
	static validatePassword(/** @type {string} */ password) {
		const err = [];

		if (!password) return [false, [new Error('Please enter a password')]];

		if (password.length < 8)
			err.push(new Error('Password must be at least 8 characters long'));
		else if (password.length > 255)
			err.push(new Error('Password must be at most 255 characters long'));

		if (
			!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w])([A-Za-z\d]|[^\w])*$/.test(
				password,
			)
		)
			err.push(
				new Error(
					'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character',
				),
			);

		if (err.length > 0)
			return [false, /** @type {[Error, ...Error[]]} */ (err)];

		return [true, undefined];
	}

	/** @returns {ResultBranched<true, false>} */
	static validateEmail(/** @type {string} */ email) {
		const err = [];

		if (!email) return [false, [new Error('Please enter an email')]];

		if (!email.match(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g))
			err.push(new Error('Please enter a valid email'));

		if (err.length > 0)
			return [false, /** @type {[Error, ...Error[]]} */ (err)];

		return [true, undefined];
	}

	/* eslint-disable */
	// https://github.com/hosseinmd/prettier-plugin-jsdoc/issues/192
	/**
	 * Get user from session
	 *
	 * @overload
	 * @returns {Promise<ResultStrict<ApiOk<User>>>}
	 */ /**
	 * Get user from id
	 *
	 * @overload
	 * @param {string} userId
	 * @returns {Promise<ResultStrict<ApiOk<ForeignUser | User>>>}
	 */ /**
	 * @param {string | undefined} userId
	 * @returns {Promise<ResultStrict<ApiOk<ForeignUser | User>>>}
	 */
	/* eslint-enable */
	async getUser(userId = undefined) {
		/** @type {User | ForeignUser | undefined} */

		cacheCheck: {
			if (userId) {
				if (userId === this.#user?.id)
					return [{ ok: true, data: this.#user }, undefined];

				let user;
				if ((user = this.#idToForeignUser.get(userId)))
					return [{ ok: true, data: user }, undefined];

				break cacheCheck;
			} else if (this.#user)
				return [{ ok: true, data: this.#user }, undefined];
			else
				cacheMissSession: {
					const [res, err] = await this.signInFromSession();

					if (err) return [undefined, err];
					return [res, undefined];
				}
		}

		cacheMissForeign: {
			let data;
			try {
				const res = await fetch('/api/v1/auth/user', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({ id: userId }),
				});
				data = await res.json();
			} catch (err) {
				return [
					undefined,
					[new Error('Network error', { cause: err })],
				];
			}

			if (!data.ok)
				switch (data.error.code) {
					case 'NOT_FOUND':
						return [undefined, [new Error('User not found')]];
					default:
						return [
							undefined,
							[
								new Error(
									`Failed to fetch user (${data.error.code})`,
									{
										cause: data.err,
									},
								),
							],
						];
				}

			this.#idToForeignUser.set(data.data.id, data.data);

			return [data, undefined];
		}
	}

	/** @returns {Promise<ResultStrict<ApiOk<User>>>} */
	async signInFromSession() {
		let data;
		try {
			const res = await fetch('/api/v1/auth/user');
			data = await res.json();
		} catch (err) {
			return [undefined, [new Error('Network error', { cause: err })]];
		}

		if (!data.ok)
			switch (data.error.code) {
				case 'FORBIDDEN':
					return [undefined, [new Error('Not authenticated')]];
				default:
					return [
						undefined,
						[
							new Error(
								`Failed to fetch user (${data.error.code})`,
							),
						],
					];
			}

		this.#user = data.data;

		return [data, undefined];
	}

	/** @returns {Promise<ResultStrict<ApiOk<User>>>} */
	async signIn(
		/** @type {string} */ username,
		/** @type {string} */ password,
	) {
		const [usernameOk, usernameErr] =
			AuthManager.validateUsername(username);
		const [passwordOk, passwordErr] =
			AuthManager.validatePassword(password);

		if (!usernameOk || !passwordOk)
			return [
				undefined,
				/** @type {[Error, ...Error[]]} */ ([
					...(usernameErr ?? []),
					...(passwordErr ?? []),
				]),
			];

		let data;
		try {
			const res = await fetch('/api/v1/auth/sign-in', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					username,
					password,
				}),
			});
			data = await res.json();
		} catch (err) {
			return [
				undefined,
				[
					new Error('Network error', {
						cause: err,
					}),
				],
			];
		}

		if (!data.ok)
			switch (data.error.code) {
				case 'SIGN_IN_USER_NOT_FOUND':
					return [undefined, [new Error('User not found')]];
				case 'SIGN_IN_INVALID_CREDENTIALS':
					return [
						undefined,
						[new Error('Wrong username or password')],
					];
				default:
					return [
						undefined,
						[
							new Error(
								`Failed to sign-in (${data.error.code})`,
								{
									cause: data.err,
								},
							),
						],
					];
			}

		this.#user = data.data;

		return [data, undefined];
	}

	/** @returns {Promise<ResultStrict<ApiOk<User>>>} */
	async signUp(
		/** @type {string} */ username,
		/** @type {string} */ email,
		/** @type {string} */ password,
	) {
		const [usernameOk, usernameErr] =
			AuthManager.validateUsername(username);
		const [emailOk, emailErr] = AuthManager.validateEmail(email);
		const [passwordOk, passwordErr] =
			AuthManager.validatePassword(password);

		if (!usernameOk || !passwordOk || !emailOk)
			return [
				undefined,
				/** @type {[Error, ...Error[]]} */ ([
					...(usernameErr ?? []),
					...(emailErr ?? []),
					...(passwordErr ?? []),
				]),
			];

		let data;
		try {
			const res = await fetch('/api/v1/auth/sign-up', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					username,
					email,
					password,
				}),
			});
			data = await res.json();
		} catch (err) {
			return [
				undefined,
				[
					new Error('Network error', {
						cause: err,
					}),
				],
			];
		}

		if (!data.ok)
			switch (data.error.code) {
				case 'SIGN_UP_USERNAME_TAKEN':
					return [
						undefined,
						[new Error('A user with that username already exists')],
					];
				case 'SIGN_UP_EMAIL_TAKEN':
					return [
						undefined,
						[new Error('A user with that email already exists')],
					];
				default:
					return [
						undefined,
						[
							new Error(
								`Failed to sign-up (${data.error.code})`,
								{
									cause: data.err,
								},
							),
						],
					];
			}

		this.#user = data.data;

		return [data, undefined];
	}

	/** @returns {Promise<ResultStrict<ApiOk<{}>>>} */
	async signOut() {
		let data;
		try {
			const res = await fetch('/api/v1/auth/sign-out', {
				method: 'POST',
			});

			data = await res.json();
		} catch (err) {
			return [
				undefined,
				[
					new Error('Network error', {
						cause: err,
					}),
				],
			];
		}

		if (!data.ok)
			return [
				undefined,
				[
					new Error(`Failed to sign-out (${data.error.code})`, {
						cause: data.err,
					}),
				],
			];

		this.#user = undefined;

		return [data, undefined];
	}
}
