export interface Provider {
  class: string;
  args?: any[];
}

export class Injector {
  private resolvedProviders = new Map();
  private providers = new Map();

  constructor(private providers = []) {
    providers.forEach(provider => this.providers.set(provider.name.toLowerCase(), provider));
  }

  get(...providers: Provider[]) {
    const resolvedProviders = providers.map(providerName => this.resolve(providerName));
    return resolvedProviders.length < 2 ? resolvedProviders[0] : resolvedProviders;
  }

  resolveProvider(provider, args: any[] = []) {
    const { _providers } = provider;
    const instance = new provider(...args, this);

    if (_providers) {
      _providers.forEach(provider => {
        instance[provider.toLowerCase()] = this.get(provider);
      });
    }

    this.resolvedProviders.set(provider.name, instance);
    return instance;
  }

  resolve(provider: Provider) {
    const { providers, resolvedProviders } = this;
    const providerName = (typeof provider === 'object' ? provider.class : provider).toLowerCase();
    
    if (resolvedProviders.has(providerName)) {
      return resolvedProviders.get(providerName);
    } else if (providers.has(providerName)) {
      return this.resolveProvider(providers.get(providerName), provider.args);      
    } else {
      throw new Error(`Missing class ${providerName}`);
    }
  }
}
