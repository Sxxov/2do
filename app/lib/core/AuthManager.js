/**
 * @typedef {{
 * 	id: string;
 * 	username: string;
 * 	email: string;
 * 	peepeepoopoo: 'peepeepoopoo';
 * }} User
 */

export class AuthManager {
	static instance = new AuthManager();

	/** @type {User | undefined} */
	#user;

	get user() {
		return this.#user;
	}

	/** @returns {ResultBranched<true, false>} */
	static validateUsername(/** @type {string} */ username) {
		if (!username) return [false, [new Error('Please enter a username')]];

		if (username.length < 3 || username.length > 20)
			return [
				false,
				[new Error('Username must be between 3 to 20 characters')],
			];

		return [true, undefined];
	}

	/** @returns {ResultBranched<true, false>} */
	static validatePassword(/** @type {string} */ password) {
		if (!password) return [false, [new Error('Please enter a password')]];

		if (password.length < 8)
			return [
				false,
				[new Error('Password must be longer than 8 characters')],
			];

		if (password.length > 255)
			return [
				false,
				[new Error('Password must be shorter than 255 characters')],
			];

		return [true, undefined];
	}

	static validateEmail(/** @type {string} */ email) {
		if (!email) return [false, [new Error('Please enter an email')]];

		if (!email.match(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g))
			return [false, [new Error('Please enter a valid email')]];

		return [true, undefined];
	}

	/** @returns {Promise<ResultStrict<ApiOk<User>>>} */
	async signInFromSession() {
		let data;
		try {
			const res = await fetch('/api/v1/auth/user.php');
			data = await res.json();
		} catch (err) {
			return [undefined, [new Error('Network error', { cause: err })]];
		}

		if (!data.ok)
			switch (data.err.code) {
				case 'FORBIDDEN':
					return [undefined, [new Error('Not authenticated')]];
				default:
					return [
						undefined,
						[new Error(`Failed to fetch user (${data.err.code})`)],
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
		if (!usernameOk) return [undefined, usernameErr];

		const [passwordOk, passwordErr] =
			AuthManager.validatePassword(password);
		if (!passwordOk) return [undefined, passwordErr];

		let data;
		try {
			const res = await fetch('/api/v1/auth/sign-in.php', {
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
			switch (data.err.code) {
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
							new Error(`Failed to sign-in (${data.err.code})`, {
								cause: data.err,
							}),
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
		if (!usernameOk) return [undefined, usernameErr];

		const [passwordOk, passwordErr] =
			AuthManager.validatePassword(password);
		if (!passwordOk) return [undefined, passwordErr];

		let data;
		try {
			const res = await fetch('/api/v1/auth/sign-up.php', {
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
			switch (data.err.code) {
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
							new Error(`Failed to sign-up (${data.err.code})`, {
								cause: data.err,
							}),
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
			const res = await fetch('/api/v1/auth/sign-out.php', {
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
					new Error(`Failed to sign-out (${data.err.code})`, {
						cause: data.err,
					}),
				],
			];

		this.#user = undefined;

		return [data, undefined];
	}
}
