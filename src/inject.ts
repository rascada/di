export interface InjectOptions {
    providers: Array;
}

export interface Resolvable {
    resolved()
}

export function Inject(options, ...providers) {
    return function (target) {
        if (typeof options === 'object') {
            const { providers }: InjectOptions = options;
            target._providers = providers;
        } else if (!options) {
            target.resolver = true;
        } else {
            target._providers = [options, ...providers];
        }
    }
}