export interface Provider {
  class: string;
  args?: any[];
}

function providerName(provider) {
  let name = '';

  if (typeof provider === 'object') {
    name = provider.class;
  } else {
    name = provider;
  }

  return name.toLowerCase();
}

export class Injector {
  private resolvedProviders = new Map();
  private providers = new Map();

  constructor(private providers = []) {
    providers.forEach(provider => this.providers.set(provider.name.toLowerCase(), provider));
  }

  get(...providers) {
    const resolvedProviders = providers.map(providerName => this.resolve(providerName));
    return resolvedProviders.length < 2 ? resolvedProviders[0] : resolvedProviders;
  }

  resolveProvider(provider, args: any[] = []) {
    const { _providers, resolver } = provider;
    const env = resolver ? [...args, this] : args;
    const instance: Resolvable = new provider(...env);

    if (_providers) {
      _providers.forEach(provider => {
        instance[providerName(provider)] = this.get(provider);
      });
    }

    this.resolvedProviders.set(provider.name, instance);
    return instance;
  }

  resolve(provider: Provider | string) {
    const { providers, resolvedProviders } = this;
    const name = providerName(provider);
    
    if (resolvedProviders.has(name)) {
      return resolvedProviders.get(name);
    } else if (providers.has(name)) {
      return this.resolveProvider(providers.get(name), provider.args);
    } else {
      throw new Error(`Missing class ${name}`);
    }
  }
}
