declare module "@asteasolutions/zod-to-openapi" {
  export class OpenAPIRegistry {
    definitions: unknown[];
    registerPath(path: unknown): void;
    registerComponent(type: string, name: string, component: unknown): void;
  }

  export class OpenApiGeneratorV3 {
    constructor(definitions: unknown[]);
    generateDocument(config: unknown): unknown;
  }
}
