export interface InjectOptions {
    providers: Array;
}

export function Inject(options, ...providers) {
    return function (target) {
        if (typeof options === 'object') {
            const { providers }: InjectOptions = options;
            target._providers = providers;
        } else {
            target._providers = [options, ...providers];
        }
    }
}