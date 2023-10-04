import { trigger, transition, query, style, animate } from '@angular/animations';
import { ActivatedRoute } from '@angular/router';

const triggerAnimationWhen = (fromState: ActivatedRoute | string): boolean => {
    if (fromState && fromState instanceof ActivatedRoute) {
        if (fromState.snapshot.routeConfig) {
            const path: string | undefined = fromState.snapshot.routeConfig.path;
            if (path) return path.includes('login') || path.includes('logout');
        }
    }
    return false
}

export const fadeInOut = trigger('fadeInOut', [
    transition(triggerAnimationWhen, [
        query(
            ':enter', [style({ opacity: 0 })],
            { optional: true }
        ),
        query(
            ':leave', [style({ opacity: 1 }), animate('200ms', style({ opacity: 0 }))],
            { optional: true }
        ),
        query(
            ':enter', [style({ opacity: 0 }), animate('500ms', style({ opacity: 1 }))],
            { optional: true }
        )
    ])
]);
