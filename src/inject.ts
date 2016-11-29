export function Inject(...providers) {
    return function (target) {
        target._providers = providers;
    }
}