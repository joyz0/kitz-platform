export type EnumClass<T extends string> = {
  // 枚举值静态属性（如 Enum.ADMIN）
  [K in T]: K;
} & {
  // 静态方法
  getOptions: () => Array<{ value: T; label: string }>;
  getLabel: (value: T) => string;
  values: readonly T[];
};

type EnumConfig<T extends string> = {
  values: readonly T[];
  labels: Record<T, string>;
};

export function createEnum<T extends string>(config: EnumConfig<T>): EnumClass<T> {
  class GeneratedEnum {
    static values = config.values;
    static labels = config.labels;

    static getOptions() {
      return this.values.map(value => ({
        value,
        label: this.labels[value]
      }));
    }

    static getLabel(value: T) {
      return this.labels[value];
    }
  }

  // 动态添加枚举值作为静态属性
  config.values.forEach(value => {
    (GeneratedEnum as any)[value] = value;
  });

  return GeneratedEnum as unknown as EnumClass<T>;
}