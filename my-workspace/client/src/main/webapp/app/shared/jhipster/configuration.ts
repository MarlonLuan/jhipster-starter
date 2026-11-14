import { type ConfigurationSection } from './configuration.model';

/** A bean of the configuration properties endpoint. */
export interface ConfigPropsBean {
  prefix: string;
  properties?: Record<string, unknown>;
}

/** The response of the configuration properties endpoint. */
export interface ConfigProps {
  contexts: Record<string, { beans: Record<string, ConfigPropsBean> }>;
}

/** The response of the environment endpoint. */
export interface Env {
  activeProfiles?: string[];
  propertySources: { name: string; properties: Record<string, { value: unknown; origin?: string }> }[];
}

/** The endpoints of the configuration page, their responses are given to `toConfiguration` in this order. */
export const configurationEndpoints = ['management/configprops', 'management/env'];

const readableValue = (value: unknown): string => (typeof value === 'string' ? value : JSON.stringify(value));

const toBeansSection = ({ contexts }: ConfigProps): ConfigurationSection => {
  const beans: Record<string, ConfigPropsBean> = Object.assign({}, ...Object.values(contexts).map(context => context.beans));
  return {
    label: { text: 'Spring configuration' },
    columns: [
      { text: 'Prefix', translationKey: 'configuration.table.prefix' },
      { text: 'Properties', translationKey: 'configuration.table.properties' },
    ],
    rows: Object.values(beans)
      .map(({ prefix, properties = {} }) => ({
        key: prefix,
        properties: Object.entries(properties).map(([key, value]) => ({ key, value: readableValue(value) })),
      }))
      .sort((a, b) => a.key.localeCompare(b.key)),
  };
};

/** Converts the responses of the `configurationEndpoints` to the tables of the configuration page. */
export const toConfiguration = (responses: unknown[]): ConfigurationSection[] => {
  const [configProps, { propertySources }] = responses as [ConfigProps, Env];
  return [
    toBeansSection(configProps),
    ...propertySources.map(({ name, properties }): ConfigurationSection => ({
      label: { text: name },
      columns: [{ text: 'Property' }, { text: 'Value' }],
      rows: Object.entries(properties).map(([key, { value }]) => ({ key, value: readableValue(value) })),
    })),
  ];
};
