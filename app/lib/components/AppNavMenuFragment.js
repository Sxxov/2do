import { X, html } from '../../../lib/common/x/X.js';

export class AppNavMenuFragment extends X {
	/** @override */
	render() {
		return html`
			<h2>General</h2>
			<a href="/app">Home</a>
			<a href="/app/calendar">Calendar</a>
			<h2>Account</h2>
			<a href="/auth/sign-out">Sign-out</a>
		`;
	}
}
customElements.define('x-app-nav-menu-fragment', AppNavMenuFragment);
