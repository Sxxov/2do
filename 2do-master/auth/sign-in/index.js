import { X, css, html, spread } from '../../lib/common/x/X.js';
import { Button } from '../../lib/components/Button.js';
import '../../lib/components/Input.js';
import { Input } from '../../lib/components/Input.js';
import '../../lib/components/Ripples.js';

export class Index extends X {
	// /** @override */
	// static properties = {
	// };

	constructor() {
		super();
	}

	/** @override */
	render() {
		return html`
			<main>
				<div class="sign-in">
					<div class="heading">
						<h1>2do</h1>
					</div>
					<form
						@formdata="${(/** @type {FormDataEvent} */ e) =>
							Input.funnelChildrenValuesInto(
								/** @type {HTMLFormElement} */ (e.target),
								e.formData,
							)}"
						@submit="${async (/** @type {SubmitEvent} */ e) => {
							e.preventDefault();

							const form = new FormData(
								/** @type {HTMLFormElement} */ (e.target),
							);

							// do something with the form data
							console.log(Object.fromEntries(form.entries()));

							const res = await fetch(
								'/api/v1/auth/sign-in.php',
								{
									method: 'POST',
									headers: {
										'Content-Type': 'application/json',
									},
									body: JSON.stringify({
										username: form.get('username'),
										password: form.get('password'),
									}),
								},
							);

							// replace with proper toast
							if (!res.ok) {
								alert('Failed to login');

								return;
							}

							const data = await res.json();
							document.cookie = `token=${data.token}; path=/;`;
						}}"
					>
						<x-input
							label="Username"
							name="username"
							type="current-username"
							autocomplete="username"
						>
							<x-i slot="left">account_circle</x-i>
						</x-input>
						<x-input
							label="Password"
							name="password"
							type="password"
							autocomplete="username"
						>
							<x-i slot="left">password</x-i>
						</x-input>
						<x-button
							${spread(Button.variants.primary)}
							type="submit"
						>
							<x-i slot="left">login</x-i>
							Sign-in
						</x-button>
						<x-button
							@click="${() => (location.href = '/auth/sign-up')}"
							${spread(Button.variants.secondary)}
							><x-i slot="left">person_add</x-i>Sign-up</x-button
						>
						<a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
							>Privacy Policy</a
						>
					</form>
				</div>
			</main>
		`;
	}

	/** @override */
	static styles = [
		...super.styles,
		css`
			main {
				padding: var(----padding);
				box-sizing: border-box;

				display: flex;
				flex-direction: column;
				gap: 14px;
				align-items: center;
				justify-content: center;
				height: 100vh;
				height: 100svh;
			}

			.sign-in {
				display: flex;
				flex-direction: column;
				gap: 42px;

				width: 100%;
				max-width: 400px;
			}

			.sign-in > .heading {
				text-align: center;
			}

			.sign-in > .heading > h1 {
				margin-top: 0;
				/* margin-bottom: 0.4em; */
			}

			.sign-in > form {
				display: flex;
				flex-direction: column;
				gap: 14px;

				width: 100%;
				align-items: center;
			}

			.sign-in > form > x-button {
				width: 100%;
			}
		`,
	];
}
customElements.define('x-index', Index);
