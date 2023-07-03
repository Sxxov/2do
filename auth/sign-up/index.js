import { AuthManager } from '../../app/lib/core/AuthManager.js';
import { X, css, html, spread } from '../../lib/common/x/X.js';
import { Button } from '../../lib/components/Button.js';
import '../../lib/components/Input.js';
import { Input } from '../../lib/components/Input.js';
import '../../lib/components/Ripples.js';
import { Toast } from '../../lib/components/Toast.js';
import { Toaster } from '../../lib/components/Toaster.js';
import '../../lib/layout/Main.js';

export class AuthSignUpRoute extends X {
	/** @override */
	render() {
		return html`
			<x-main>
				<div class="sign-in">
					<div class="content">
						<div class="heading">
							<h5>Sign-up</h5>
							<p>Start your to-doing journey now.</p>
						</div>
						<form
							id="sign-up"
							@keydown="${(/** @type {KeyboardEvent} */ e) => {
								if (e.key === 'Enter') {
									// blur focus from input to emit `change` event
									/** @type {HTMLElement} */ (
										e.target
									)?.blur?.();

									e.preventDefault();
									e.stopPropagation();
									/** @type {HTMLFormElement} */ (
										e.currentTarget
									).dispatchEvent(
										new SubmitEvent('submit', {
											cancelable: true,
											composed: true,
											bubbles: true,
										}),
									);
								}
							}}"
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

								const email = String(form.get('email'));
								const username = String(form.get('username'));
								const password = String(form.get('password'));
								const confirmPassword = String(
									form.get('confirm-password'),
								);

								verifyConfirmPassword: {
									if (!password)
										// haven't input password, no need verify
										break verifyConfirmPassword;

									if (!confirmPassword) {
										Toaster.toast(
											'Please confirm your password',
											Toast.variants.error,
										);
										return;
									}

									if (confirmPassword !== password) {
										Toaster.toast(
											'Passwords do not match',
											Toast.variants.error,
										);
										return;
									}

									// ok
								}

								const [res, err] =
									await AuthManager.instance.signUp(
										username,
										email,
										password,
									);

								if (err) {
									for (const { message } of err)
										Toaster.toast(
											message,
											Toast.variants.error,
										);
									return;
								}

								Toaster.toast(
									'Successfully signed up',
									Toast.variants.ok,
								);

								if (res.redirect != null)
									location.href = res.redirect;
							}}"
						>
							<x-input
								label="Username"
								name="username"
								type="current-username"
								autocomplete="username"
								required
								minlength="3"
								maxlength="20"
								pattern="\\w_-"
							>
								<x-i slot="left">account_circle</x-i>
							</x-input>
							<x-input
								label="Email"
								name="email"
								type="email"
								autocomplete="email"
								required
								minlength="3"
								maxlength="20"
								pattern="\\w_-"
							>
								<x-i slot="left">email</x-i>
							</x-input>
							<hr />
							<x-input
								label="Password"
								name="password"
								type="password"
								autocomplete="username"
								required
								minlength="8"
								maxlength="255"
							>
								<x-i slot="left">password</x-i>
							</x-input>

							<x-input
								label="Confirm Password"
								name="confirm-password"
								type="password"
								autocomplete="username"
								required
								minlength="8"
								maxlength="255"
							>
								<x-i slot="left">password</x-i>
							</x-input>
							<x-button
								${spread(Button.variants.primary)}
								type="submit"
							>
								<x-i slot="left">person_add</x-i>
								Sign-up
								<x-i slot="right">_</x-i>
							</x-button>
							<div class="sign-up">
								<h4>Have an<br />account?</h4>
								<a href="/auth/sign-in">Sign-in</a>
							</div>
						</form>
					</div>
				</div>
			</x-main>
		`;
	}

	/** @override */
	static styles = [
		...super.styles,
		css`
			.sign-in {
				padding: var(----padding);
				box-sizing: border-box;

				display: flex;
				flex-direction: column;
				gap: 14px;
				align-items: center;
				justify-content: center;
			}

			.sign-in > .content {
				display: flex;
				flex-direction: column;
				gap: 42px;

				width: 100%;
				max-width: 400px;
			}

			.sign-in > .content > .heading {
				text-align: center;
			}

			.sign-in > .content > .heading > h1 {
				margin-top: 0;
				/* margin-bottom: 0.4em; */
			}

			.sign-in > .content > form {
				display: flex;
				flex-direction: column;
				gap: 14px;

				width: 100%;
				align-items: center;
			}

			.sign-in > .content > form > x-button {
				width: 100%;
			}

			.sign-in > .content > form > .sign-up {
				text-align: center;
				font-weight: 700;
				text-transform: uppercase;
			}
		`,
	];
}
customElements.define('x-index', AuthSignUpRoute);
