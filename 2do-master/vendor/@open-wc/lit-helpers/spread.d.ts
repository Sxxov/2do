mport { Part } from 'lit';
import { AsyncDirective } from 'lit/async-directive.js';
declare type EventListenerWithOptions = EventListenerOrEventListenerObject & Partial<AddEventListenerOptions>;
/**
 * Usage:
 *    import { html, render } from 'lit';
 *    import { spreadProps } from '@open-wc/lit-helpers';
 *
 *    render(
 *      html`
 *        <div
 *          ${spreadProps({
 *              prop1: 'prop1',
 *              prop2: ['Prop', '2'],
 *              prop3: {
 *                  prop: 3,
 *              }
 *          })}
 *        ></div>
 *      `,
 *      document.body,
 *    );
 */
export declare class SpreadPropsDirective extends AsyncDirective {
    host: EventTarget | object | Element;
    element: Element;
    prevData: {
        [key: string]: unknown;
    };
    render(_spreadData: {
        [key: string]: unknown;
    }): symbol;
    update(part: Part, [spreadData]: Parameters<this['render']>): void;
    apply(data: {
        [key: string]: unknown;
    }): void;
    groom(data: {
        [key: string]: unknown;
    }): void;
}
export declare const spreadProps: (_spreadData: {
    [key: string]: unknown;
}) => import("lit-html/directive").DirectiveResult<typeof SpreadPropsDirective>;
/**
 * Usage:
 *    import { html, render } from 'lit';
 *    import { spreadEvents } from '@open-wc/lit-helpers';
 *
 *    render(
 *      html`
 *        <div
 *          ${spreadEvents({
 *            '@my-event': () => console.log('my-event fired'),
 *            '@my-other-event': () => console.log('my-other-event fired'),
 *            '@my-additional-event':
 *              () => console.log('my-additional-event fired'),
 *          })}
 *        ></div>
 *      `,
 *      document.body,
 *    );
 */
export declare class SpreadEventsDirective extends SpreadPropsDirective {
    eventData: {
        [key: string]: unknown;
    };
    apply(data: {
        [key: string]: unknown;
    }): void;
    applyEvent(eventName: string, eventValue: EventListenerWithOptions): void;
    groom(data: {
        [key: string]: unknown;
    }): void;
    groomEvent(eventName: string, eventValue: EventListenerWithOptions): void;
    handleEvent(event: Event): void;
    disconnected(): void;
    reconnected(): void;
}
export declare const spreadEvents: (_spreadData: {
    [key: string]: unknown;
}) => import("lit-html/directive").DirectiveResult<typeof SpreadEventsDirective>;
/**
 * Usage:
 *    import { html, render } from 'lit';
 *    import { spread } from '@open-wc/lit-helpers';
 *
 *    render(
 *      html`
 *        <div
 *          ${spread({
 *            'my-attribute': 'foo',
 *            '?my-boolean-attribute': true,
 *            '.myProperty': { foo: 'bar' },
 *            '@my-event': () => console.log('my-event fired'),
 *          })}
 *        ></div>
 *      `,
 *      document.body,
 *    );
 */
export declare class SpreadDirective extends SpreadEventsDirective {
    apply(data: {
        [key: string]: unknown;
    }): void;
    groom(data: {
        [key: string]: unknown;
    }): void;
}
export declare const spread: (_spreadData: {
    [key: string]: unknown;
}) => import("lit-html/directive").DirectiveResult<typeof SpreadDirective>;
export {};
//# sourceMappingURL=spread.d.ts.map