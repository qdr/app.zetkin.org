#!/usr/bin/env ts-node

import ts from 'typescript';
import * as fs from 'fs';
import * as path from 'path';
import { glob } from 'glob';
import * as TJS from 'ts-json-schema-generator';
import { OpenAPIV3 } from 'openapi-types';
import OpenAPIObject = OpenAPIV3.Document;
import PathsObject = OpenAPIV3.PathsObject;
import PathItemObject = OpenAPIV3.PathItemObject;
import OperationObject = OpenAPIV3.OperationObject;
import ParameterObject = OpenAPIV3.ParameterObject;
import SchemaObject = OpenAPIV3.SchemaObject;
import ReferenceObject = OpenAPIV3.ReferenceObject;
import ExampleObject = OpenAPIV3.ExampleObject;
import HttpMethods = OpenAPIV3.HttpMethods;
import NonArraySchemaObjectType = OpenAPIV3.NonArraySchemaObjectType;

export interface ApiEndpoint {
  method: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';
  path: string;
  responseType?: string;
  requestType?: string;
  fileLocation: string;
  lineNumber: number;
  pathParams: string[];
  queryParams: string[];
}

export interface RpcEndpoint {
  name: string;
  paramsSchema?: SchemaObject;
  resultType?: string;
  fileLocation: string;
  lineNumber: number;
}

export class OpenApiGenerator {
  private readonly VALID_API_PREFIXES = ['/api', '/api2', '/beta'];
  private endpoints: Map<string, ApiEndpoint[]> = new Map();
  private rpcEndpoints: RpcEndpoint[] = [];
  private program: ts.Program;
  private schemaGenerator: TJS.SchemaGenerator | null = null;
  private typeFiles: string[] = [];

  constructor(
    private rootDir: string,
    private debug: (...data: unknown[]) => void
  ) {
    this.debug('Initializing TypeScript compiler...');

    const compilerOptions: ts.CompilerOptions = {
      target: ts.ScriptTarget.ES2020,
      module: ts.ModuleKind.ESNext,
      jsx: ts.JsxEmit.React,
      allowJs: true,
      skipLibCheck: true,
      strict: false,
      noEmit: true,
    };

    const files = glob.sync('**/*.{ts,tsx}', {
      cwd: rootDir,
      ignore: ['node_modules/**', '.next/**', 'dist/**', 'build/**'],
      absolute: true,
    });

    this.program = ts.createProgram(files, compilerOptions);

    // Find all type files
    this.debug('Loading type definitions...');
    this.typeFiles = [
      path.join(rootDir, 'src/utils/types/zetkin.ts'),
      ...glob.sync('src/features/**/types.ts', {
        cwd: rootDir,
        absolute: true,
      }),
    ];

    this.debug(`Found ${this.typeFiles.length} type definition files`);

    // Create a single schema generator with the primary types file
    try {
      const config: TJS.Config = {
        path: path.join(rootDir, 'src/utils/types/zetkin.ts'),
        tsconfig: path.join(rootDir, 'tsconfig.json'),
        skipTypeCheck: true,
        expose: 'export',
        topRef: false,
      };
      this.schemaGenerator = TJS.createGenerator(config);
      this.debug(`  ✓ Loaded type definitions (will resolve imports automatically)`);
    } catch (e) {
      console.error('  ✗ Failed to load type definitions:', e);
    }
  }

  public async parse(): Promise<void> {
    const sourceFiles = this.program
      .getSourceFiles()
      .filter((sf) => !sf.fileName.includes('node_modules'));

    this.debug(`\nParsing ${sourceFiles.length} source files for API endpoints...`);

    let processedFiles = 0;
    const totalFiles = sourceFiles.length;
    const startTime = Date.now();

    for (const sourceFile of sourceFiles) {
      this.visitNode(sourceFile, sourceFile);
      processedFiles++;

      // Show progress every 100 files
      if (processedFiles % 100 === 0 || processedFiles === totalFiles) {
        const percent = Math.round((processedFiles / totalFiles) * 100);
        const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
        process.stdout.write(
          `\r  Progress: ${processedFiles}/${totalFiles} files (${percent}%) - ${elapsed}s`
        );
      }
    }

    this.debug('\n');
    this.debug(`Found ${this.getTotalEndpoints()} REST endpoints`);
    this.debug(`Found ${this.rpcEndpoints.length} RPC endpoints`);
  }

  public printStats(): void {
    this.debug('\n=== OpenAPI Generation Statistics ===');
    this.debug(`Total REST endpoints: ${this.getTotalEndpoints()}`);
    this.debug(`Unique paths: ${this.endpoints.size}`);
    this.debug(`RPC endpoints: ${this.rpcEndpoints.length}`);

    const methodCounts: Record<string, number> = {};
    for (const endpoints of this.endpoints.values()) {
      for (const endpoint of endpoints) {
        methodCounts[endpoint.method] =
          (methodCounts[endpoint.method] || 0) + 1;
      }
    }

    this.debug('\nEndpoints by HTTP method:');
    for (const [method, count] of Object.entries(methodCounts).sort()) {
      this.debug(`  ${method}: ${count}`);
    }

    this.debug('\nTop 10 most used paths:');
    const sortedPaths = Array.from(this.endpoints.entries())
      .sort((a, b) => b[1].length - a[1].length)
      .slice(0, 10);

    for (const [path, endpoints] of sortedPaths) {
      this.debug(`  ${path}: ${endpoints.length} calls`);
    }
  }

  private visitNode(node: ts.Node, sourceFile: ts.SourceFile): void {
    if (ts.isCallExpression(node)) {
      this.processCallExpression(node, sourceFile);
    }

    if (ts.isVariableDeclaration(node)) {
      this.processRpcDefinition(node, sourceFile);
    }

    ts.forEachChild(node, (child) => this.visitNode(child, sourceFile));
  }

  private processCallExpression(
    node: ts.CallExpression,
    sourceFile: ts.SourceFile
  ): void {
    const expression = node.expression;

    if (!ts.isPropertyAccessExpression(expression)) {
      return;
    }

    const methodName = expression.name.text;
    const httpMethods = ['get', 'post', 'patch', 'put', 'delete'];

    if (!httpMethods.includes(methodName)) {
      return;
    }

    const pathArg = node.arguments[0];
    if (!pathArg) {
      return;
    }

    const endpointPath = this.extractPathString(pathArg);
    if (!endpointPath) {
      return;
    }

    const typeArguments = node.typeArguments;
    const responseType = typeArguments?.[0]
      ? this.typeToString(typeArguments[0], sourceFile)
      : undefined;
    const requestType = typeArguments?.[1]
      ? this.typeToString(typeArguments[1], sourceFile)
      : undefined;

    const { line } = sourceFile.getLineAndCharacterOfPosition(
      node.getStart(sourceFile)
    );
    const relativeFile = path
      .relative(this.rootDir, sourceFile.fileName)
      .replace(/\\/g, '/');

    const pathParams = this.extractPathParams(endpointPath);
    const queryParams = this.extractQueryParams(endpointPath);

    const endpoint: ApiEndpoint = {
      method: methodName.toUpperCase() as ApiEndpoint['method'],
      path: endpointPath,
      responseType,
      requestType,
      fileLocation: relativeFile,
      lineNumber: line + 1,
      pathParams,
      queryParams,
    };

    const normalizedPath = this.normalizePath(endpointPath);

    if (!this.endpoints.has(normalizedPath)) {
      this.endpoints.set(normalizedPath, []);
    }
    this.endpoints.get(normalizedPath)!.push(endpoint);
  }

  private processRpcDefinition(
    node: ts.VariableDeclaration,
    sourceFile: ts.SourceFile
  ): void {
    if (!ts.isIdentifier(node.name)) {
      return;
    }

    const name = node.name.getText(sourceFile);

    if (!name.endsWith('Def')) {
      return;
    }

    const relativeFile = path
      .relative(this.rootDir, sourceFile.fileName)
      .replace(/\\/g, '/');

    if (!relativeFile.includes('/rpc/')) {
      return;
    }

    const { line } = sourceFile.getLineAndCharacterOfPosition(
      node.getStart(sourceFile)
    );

    const rpcName = name.replace('Def', '');

    let paramsSchema: SchemaObject | undefined = undefined;
    const resultType: string | undefined = undefined;

    if (node.initializer && ts.isObjectLiteralExpression(node.initializer)) {
      const properties = node.initializer.properties;

      let actualName = rpcName;
      for (const prop of properties) {
        if (
          ts.isPropertyAssignment(prop) &&
          ts.isIdentifier(prop.name) &&
          prop.name.text === 'name' &&
          ts.isStringLiteral(prop.initializer)
        ) {
          actualName = prop.initializer.text;
        }
        if (
          ts.isPropertyAssignment(prop) &&
          ts.isIdentifier(prop.name) &&
          prop.name.text === 'schema'
        ) {
          paramsSchema = this.extractZodSchema(prop.initializer, sourceFile);
        }
      }

      this.rpcEndpoints.push({
        name: actualName,
        paramsSchema,
        resultType,
        fileLocation: relativeFile,
        lineNumber: line + 1,
      });
    }
  }

  private extractPathString(node: ts.Node): string | null {
    let path: string | null = null;

    if (ts.isStringLiteral(node)) {
      path = node.text;
    } else if (
      ts.isTemplateExpression(node) ||
      ts.isNoSubstitutionTemplateLiteral(node)
    ) {
      path = this.templateToPath(node);
    }

    if (path && this.isValidApiPath(path)) {
      return path;
    }

    return null;
  }

  private isValidApiPath(path: string): boolean {
    return this.VALID_API_PREFIXES.some((prefix) => path.startsWith(prefix));
  }

  private templateToPath(node: ts.TemplateLiteral): string {
    if (ts.isNoSubstitutionTemplateLiteral(node)) {
      return node.text;
    }

    let result = node.head.text;

    for (const span of (node as ts.TemplateExpression).templateSpans) {
      const expression = span.expression;
      const paramName = this.getParameterName(expression);
      result += `{${paramName}}`;
      result += span.literal.text;
    }

    return result;
  }

  private getParameterName(expression: ts.Expression): string {
    if (ts.isIdentifier(expression)) {
      return expression.text;
    }

    if (ts.isPropertyAccessExpression(expression)) {
      return expression.name.text;
    }

    return 'param';
  }

  private normalizeParamName(paramName: string, pathContext: string): string {
    const lower = paramName.toLowerCase();

    if (lower.includes('org') && !lower.includes('target')) {
      return 'orgId';
    }
    if (lower.includes('campaign')) {
      return 'projId';
    }
    if (lower.includes('event') || lower.includes('action')) {
      return 'eventId';
    }
    if (lower.includes('person')) {
      return 'personId';
    }
    if (lower.includes('survey')) {
      return 'surveyId';
    }
    if (lower.includes('task')) {
      return 'taskId';
    }
    if (lower.includes('call')) {
      return 'callId';
    }
    if (lower.includes('assignment')) {
      return 'assignmentId';
    }
    if (lower.includes('email')) {
      return 'emailId';
    }
    if (lower.includes('view')) {
      return 'viewId';
    }
    if (lower.includes('form')) {
      return 'formId';
    }
    if (lower.includes('file')) {
      return 'fileId';
    }

    if (paramName === 'id' || paramName === 'param') {
      const pathSegments = pathContext.split('/').filter((s) => s);

      for (let i = 0; i < pathSegments.length; i++) {
        const segment = pathSegments[i];

        if (segment.includes('{') && segment.includes('}')) {
          const placeholder = segment.match(/\{([^}]+)\}/)?.[1];
          if (placeholder === paramName) {
            const prevSegment = i > 0 ? pathSegments[i - 1] : '';

            if (prevSegment === 'orgs') return 'orgId';
            if (prevSegment === 'campaigns') return 'projId';
            if (prevSegment === 'actions' || prevSegment === 'events')
              return 'eventId';
            if (prevSegment === 'people') return 'personId';
            if (
              prevSegment === 'surveys' ||
              prevSegment === 'survey_submissions'
            )
              return 'submissionId';
            if (prevSegment === 'tasks') return 'taskId';
            if (prevSegment === 'call_assignments') return 'assignmentId';
            if (prevSegment === 'emails') return 'emailId';
            if (prevSegment === 'views') return 'viewId';
            if (prevSegment === 'calls') return 'callId';
          }
        }
      }
    }

    return paramName;
  }

  private extractPathParams(path: string): string[] {
    const pathPart = path.split('?')[0];
    const matches = pathPart.match(/\{([^}]+)\}/g);
    if (!matches) {
      return [];
    }
    return matches.map((m) => {
      const paramName = m.slice(1, -1);
      return this.normalizeParamName(paramName, pathPart);
    });
  }

  private extractQueryParams(path: string): string[] {
    const queryIndex = path.indexOf('?');
    if (queryIndex === -1) {
      return [];
    }

    const queryString = path.slice(queryIndex + 1);
    const params = queryString.split('&');

    const paramNames = new Set<string>();

    for (const param of params) {
      let paramName = param.split('=')[0];

      if (paramName.includes('[')) {
        paramName = paramName.split('[')[0];
      }

      if (paramName.startsWith('${') && paramName.endsWith('}')) {
        continue;
      }

      if (paramName.startsWith('${')) {
        paramName = paramName.slice(2);
        if (paramName.endsWith('}')) {
          paramName = paramName.slice(0, -1);
        }
      }

      if (
        !paramName.includes('%3E') &&
        !paramName.includes('%3C') &&
        !paramName.includes('{') &&
        !paramName.includes('}') &&
        !paramName.includes('$') &&
        paramName.length > 0
      ) {
        paramNames.add(paramName);
      }
    }

    return Array.from(paramNames);
  }

  private normalizePath(path: string): string {
    const queryIndex = path.indexOf('?');
    if (queryIndex !== -1) {
      path = path.slice(0, queryIndex);
    }

    if (path.length > 1 && path.endsWith('/')) {
      path = path.slice(0, -1);
    }

    path = path.replace(/\{([^}]+)\}/g, (_match, paramName) => {
      const normalized = this.normalizeParamName(paramName, path);
      return `{${normalized}}`;
    });

    return path;
  }

  private typeToString(type: ts.TypeNode, sourceFile?: ts.SourceFile): string {
    return type.getText(sourceFile);
  }

  private typeToSchema(typeName: string): SchemaObject {
    if (typeName.endsWith('[]')) {
      const itemType = typeName.slice(0, -2);
      return {
        type: 'array',
        items: this.typeToSchema(itemType),
      };
    }

    const primitiveMap: Record<string, NonArraySchemaObjectType | undefined> = {
      string: 'string',
      number: 'number',
      boolean: 'boolean',
      any: 'object',
      unknown: 'object',
      void: undefined,
    };

    if (primitiveMap[typeName]) {
      return { type: primitiveMap[typeName] };
    }

    // Try to generate schema from the unified generator
    if (this.schemaGenerator) {
      try {
        const schema = this.schemaGenerator.createSchema(typeName);
        if (schema && typeof schema === 'object') {
          const mainSchema: any = schema.definitions?.[typeName] || schema;
          if (mainSchema && mainSchema.type === 'object') {
            // Try to find which type file defines this type
            const typeFile = this.findTypeFile(typeName);
            if (typeFile) {
              const relativePath = path.relative(this.rootDir, typeFile);
              if (!mainSchema.description) {
                mainSchema.description = `(${relativePath})`;
              } else {
                mainSchema.description += ` (${relativePath})`;
              }
            }

            this.fixNullableTypes(mainSchema);
            this.addDateFormats(mainSchema);
            return mainSchema;
          }
        }
      } catch (e) {
        // Type not found, continue to fallback
      }
    }

    let typeLabel = 'Type';
    if (typeName.includes('<')) {
      typeLabel = 'Generic Type';
    } else if (
      typeName.includes('Partial<') ||
      typeName.includes('Omit<') ||
      typeName.includes('Pick<')
    ) {
      typeLabel = 'Complex Type';
    } else if (typeName.startsWith('{')) {
      typeLabel = 'Inline Type';
    }

    return {
      type: 'object',
      description: `${typeLabel}: ${typeName}`,
    };
  }

  private findTypeFile(typeName: string): string | null {
    // Search through type files to find where the type is defined
    for (const typeFile of this.typeFiles) {
      try {
        const content = fs.readFileSync(typeFile, 'utf-8');
        // Look for type or interface declarations
        const typeRegex = new RegExp(
          `(export\\s+)?(type|interface)\\s+${typeName}\\s*[=<{]`
        );
        if (typeRegex.test(content)) {
          return typeFile;
        }
      } catch (e) {
        // Continue searching
      }
    }
    return null;
  }

  private fixNullableTypes(schema: any): any {
    if (!schema || typeof schema !== 'object') {
      return schema;
    }

    if (schema.properties) {
      for (const [propName, propSchema] of Object.entries(schema.properties)) {
        if (typeof propSchema === 'object' && propSchema !== null) {
          const ps = propSchema as any;

          if (Array.isArray(ps.type)) {
            const types = ps.type.filter((t: string) => t !== 'null');
            if (ps.type.includes('null')) {
              ps.nullable = true;
              if (types.length === 1) {
                ps.type = types[0];
              } else if (types.length > 1) {
                ps.type = types;
              }
            }
          }

          this.fixNullableTypes(propSchema);
        }
      }
    }

    if (schema.definitions) {
      for (const defSchema of Object.values(schema.definitions)) {
        this.fixNullableTypes(defSchema);
      }
    }

    return schema;
  }

  private addDateFormats(schema: any): any {
    if (!schema || typeof schema !== 'object') {
      return schema;
    }

    const dateFieldNames = [
      'published',
      'expires',
      'start_time',
      'end_time',
      'created',
      'updated',
      'cancelled',
      'attended',
      'noshow',
      'reminder_sent',
      'response_date',
      'uploaded',
      'timestamp',
      'date',
      'datetime',
      'booked',
      'completed',
    ];

    if (schema.properties) {
      for (const [propName, propSchema] of Object.entries(schema.properties)) {
        const lowerName = propName.toLowerCase();

        if (dateFieldNames.some((field) => lowerName.includes(field))) {
          if (typeof propSchema === 'object' && propSchema !== null) {
            const ps = propSchema as any;
            if (ps.type === 'string') {
              ps.format = 'date-time';
            } else if (Array.isArray(ps.type) && ps.type.includes('string')) {
              ps.format = 'date-time';
            }
          }
        }

        if (typeof propSchema === 'object') {
          this.addDateFormats(propSchema);
        }
      }
    }

    if (schema.definitions) {
      for (const defSchema of Object.values(schema.definitions)) {
        this.addDateFormats(defSchema);
      }
    }

    return schema;
  }

  private extractZodSchema(
    node: ts.Node,
    sourceFile: ts.SourceFile
  ): SchemaObject | undefined {
    if (ts.isIdentifier(node)) {
      const schemaName = node.text;
      const foundSchema = this.findSchemaDefinition(schemaName, sourceFile);
      if (foundSchema) {
        return foundSchema;
      }
    }

    const text = node.getText(sourceFile);

    if (text.includes('z.object')) {
      const properties: Record<string, SchemaObject | ReferenceObject> = {};
      const required: string[] = [];

      const objectMatch = text.match(/z\.object\(\{([\s\S]+?)\}\)/);
      if (objectMatch) {
        const propsText = objectMatch[1];
        const propRegex = /(\w+):\s*z\.(\w+)\([^)]*\)/g;
        let match;

        while ((match = propRegex.exec(propsText)) !== null) {
          const [, propName, zodType] = match;
          properties[propName] = this.zodTypeToOpenApi(zodType);
          required.push(propName);
        }
      }

      return {
        type: 'object',
        properties,
        required: required.length > 0 ? required : undefined,
      };
    }

    return undefined;
  }

  private findSchemaDefinition(
    schemaName: string,
    sourceFile: ts.SourceFile
  ): SchemaObject | undefined {
    let foundSchema: SchemaObject | undefined = undefined;

    const visit = (node: ts.Node) => {
      if (ts.isVariableStatement(node)) {
        for (const declaration of node.declarationList.declarations) {
          if (
            ts.isIdentifier(declaration.name) &&
            declaration.name.text === schemaName &&
            declaration.initializer
          ) {
            foundSchema = this.extractZodSchema(
              declaration.initializer,
              sourceFile
            );
            return;
          }
        }
      }
      ts.forEachChild(node, visit);
    };

    visit(sourceFile);
    return foundSchema;
  }

  private zodTypeToOpenApi(zodType: string): SchemaObject | ReferenceObject {
    const typeMap: Record<string, SchemaObject | ReferenceObject> = {
      string: { type: 'string' },
      number: { type: 'number' },
      boolean: { type: 'boolean' },
      date: { type: 'string', format: 'date-time' },
      array: { type: 'array', items: { type: 'string' } },
      object: { type: 'object' },
    };

    return typeMap[zodType] || { type: 'object' };
  }

  private getTotalEndpoints(): number {
    let total = 0;
    for (const endpoints of this.endpoints.values()) {
      total += endpoints.length;
    }
    return total;
  }

  public generateOpenApi(): OpenAPIObject {
    this.debug('\nGenerating OpenAPI specification...');
    const paths: PathsObject = {};

    const sortedPaths = Array.from(this.endpoints.entries()).sort((a, b) =>
      a[0].localeCompare(b[0])
    );

    this.debug(`Building ${sortedPaths.length} API path definitions...`);
    let processedPaths = 0;

    for (const [pathKey, endpoints] of sortedPaths) {
      processedPaths++;
      if (processedPaths % 20 === 0 || processedPaths === sortedPaths.length) {
        const percent = Math.round((processedPaths / sortedPaths.length) * 100);
        process.stdout.write(
          `\r  Progress: ${processedPaths}/${sortedPaths.length} paths (${percent}%)`
        );
      }

      const pathItem: PathItemObject = {};

      const methodGroups = new Map<string, ApiEndpoint[]>();
      for (const endpoint of endpoints) {
        if (!methodGroups.has(endpoint.method)) {
          methodGroups.set(endpoint.method, []);
        }
        methodGroups.get(endpoint.method)!.push(endpoint);
      }

      for (const [method, methodEndpoints] of methodGroups) {
        const canonicalEndpoint = methodEndpoints[0];

        const allQueryParams = new Set<string>();
        for (const endpoint of methodEndpoints) {
          endpoint.queryParams.forEach((p) => allQueryParams.add(p));
        }

        let description = `${canonicalEndpoint.fileLocation}:${canonicalEndpoint.lineNumber}`;

        if (canonicalEndpoint.path.includes('breadcrumbs')) {
          description +=
            '\n\nExample: `GET /api/breadcrumbs?pathname=/organize/[orgId]/projects&orgId=2`';
        }

        const operation: OperationObject = {
          summary: this.generateSummary(canonicalEndpoint),
          description,
          tags: this.extractTags(canonicalEndpoint.path),
          responses: {},
        };

        const parameters: ParameterObject[] = [];
        const addedParams = new Set<string>();

        for (const param of canonicalEndpoint.pathParams) {
          if (!addedParams.has(param)) {
            parameters.push({
              name: param,
              in: 'path',
              required: true,
              schema: {
                type: this.guessParamType(param),
                example: this.getExampleValue(param),
              },
            });
            addedParams.add(param);
          }
        }

        for (const param of Array.from(allQueryParams).sort()) {
          if (!addedParams.has(param)) {
            const paramType = this.guessParamType(param);
            const schema: any = {
              type: paramType,
              example: this.getExampleValue(param),
            };

            // Add default value for specific parameters
            const paramLower = param.toLowerCase();
            if (paramLower === 'recursive') {
              schema.default = false;
            }
            if (paramLower === 'filter') {
              schema.default = '';
            }
            if (paramLower === 'page') {
              schema.default = 1;
            }
            if (paramLower === 'size') {
              schema.default = 50;
            }
            if (paramLower === 'offset') {
              schema.default = 0;
            }
            if (paramLower === 'limit') {
              schema.default = 50;
            }

            const paramObj: ParameterObject = {
              name: param,
              in: 'query',
              required: false,
              schema: schema,
            };

            const description = this.getParamDescription(
              param,
              canonicalEndpoint.path
            );
            if (description) {
              paramObj.description = description;
            }

            parameters.push(paramObj);
            addedParams.add(param);
          }
        }

        if (
          canonicalEndpoint.path.includes('breadcrumbs') &&
          !addedParams.has('orgId')
        ) {
          parameters.push({
            name: 'orgId',
            in: 'query',
            required: false,
            schema: {
              type: 'integer',
              example: 2,
            },
            description:
              'Organization ID to resolve [orgId] placeholder in pathname',
          });
        }

        if (parameters.length > 0) {
          operation.parameters = parameters;
        }

        if (
          ['POST', 'PATCH', 'PUT'].includes(canonicalEndpoint.method) &&
          canonicalEndpoint.requestType
        ) {
          operation.requestBody = {
            required: true,
            content: {
              'application/json': {
                schema: this.typeToSchema(canonicalEndpoint.requestType),
              },
            },
          };
        } else if (
          ['POST', 'PATCH', 'PUT'].includes(canonicalEndpoint.method)
        ) {
          operation.requestBody = {
            required: true,
            content: {
              'application/json': {
                schema: { type: 'object' },
              },
            },
          };
        }

        operation.responses = {
          200: {
            description: 'Successful response',
            content: canonicalEndpoint.responseType
              ? {
                  'application/json': {
                    schema: this.typeToSchema(canonicalEndpoint.responseType),
                  },
                }
              : {},
          },
          400: {
            description: 'Bad request',
          },
          401: {
            description: 'Unauthorized',
          },
          403: {
            description: 'Forbidden',
          },
          404: {
            description: 'Not found',
          },
        };

        pathItem[method.toLowerCase() as HttpMethods] = operation;
      }

      paths[pathKey] = pathItem;
    }

    this.debug('\n');

    if (this.rpcEndpoints.length > 0) {
      this.debug(`Processing ${this.rpcEndpoints.length} RPC endpoints...`);
      const sortedRpcEndpoints = [...this.rpcEndpoints].sort((a, b) =>
        a.name.localeCompare(b.name)
      );

      const allFuncNames = sortedRpcEndpoints.map((rpc) => rpc.name);

      const examples: Record<string, ReferenceObject | ExampleObject> = {};
      for (const rpc of sortedRpcEndpoints) {
        const exampleParams: Record<string, unknown> = {};
        if (rpc.paramsSchema?.properties) {
          for (const [key, propSchema] of Object.entries(
            rpc.paramsSchema.properties
          )) {
            if (!('type' in propSchema)) {
              continue;
            }

            if (propSchema.type === 'string') {
              exampleParams[key] = 'string';
            } else if (propSchema.type === 'number') {
              exampleParams[key] = key.toLowerCase().includes('id') ? 1 : 0;
            } else if (propSchema.type === 'boolean') {
              exampleParams[key] = false;
            } else {
              exampleParams[key] = null;
            }
          }
        }

        examples[rpc.name] = {
          summary: `RPC: ${rpc.name}`,
          description: `${rpc.fileLocation}:${rpc.lineNumber}`,
          value: {
            func: rpc.name,
            params: exampleParams,
          },
        };
      }

      paths['/api/rpc'] = {
        post: {
          summary: 'Remote Procedure Call (RPC) Endpoint',
          description:
            'Execute RPC functions. All RPC calls use this single endpoint with the function name in the `func` parameter.',
          tags: ['RPC'],
          operationId: 'rpc',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['func', 'params'],
                  properties: {
                    func: {
                      type: 'string',
                      description: 'RPC function name to execute',
                      enum: allFuncNames,
                    },
                    params: {
                      type: 'object',
                      description:
                        'Function parameters (see examples for each function)',
                    },
                  },
                },
                examples,
              },
            },
          },
          responses: {
            200: {
              description: 'RPC call successful',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    required: ['result'],
                    properties: {
                      result: {
                        type: 'object',
                        description:
                          'Result object (structure varies by function)',
                      },
                    },
                  },
                },
              },
            },
            400: {
              description: 'Bad request - invalid parameters',
            },
            404: {
              description: 'RPC function not found',
            },
          },
        },
      };
    }

    const openapi: OpenAPIObject = {
      openapi: '3.0.0',
      info: {
        title: 'Zetkin APIs',
        version: '1.0.0',
        description:
          'Auto-generated API documentation from the https://github.com/zetkin/app.zetkin.org repo',
      },
      paths,
      components: {
        schemas: {},
        securitySchemes: {
          cookieAuth: {
            type: 'apiKey',
            in: 'cookie',
            name: 'zsid',
            description:
              'Session cookie (zsid). To get this:\n' +
              '1. Log in at http://localhost:3000\n' +
              '2. Open DevTools (F12) > Application/Storage > Cookies\n' +
              '3. Copy the zsid cookie value\n' +
              '4. Paste it in the Value field below',
          },
        },
      },
      security: [
        {
          cookieAuth: [],
        },
      ],
      tags: this.generateTags(),
    };

    // Hoist all nested definitions to root level
    this.debug('Flattening schema definitions...');
    this.hoistDefinitions(openapi);

    return openapi;
  }

  private hoistDefinitions(openapi: any): void {
    const allDefinitions: Record<string, any> = {};

    // Recursively find and collect all definitions
    const collectDefinitions = (obj: any, parentPath: string = '') => {
      if (!obj || typeof obj !== 'object') {
        return;
      }

      // If this object has a definitions property, merge them
      if (obj.definitions && typeof obj.definitions === 'object') {
        for (const [defName, defSchema] of Object.entries(obj.definitions)) {
          if (!allDefinitions[defName]) {
            allDefinitions[defName] = defSchema;
          }
        }
        // Remove the definitions from the nested location
        delete obj.definitions;
      }

      // Recursively process all properties
      for (const key in obj) {
        if (obj.hasOwnProperty(key) && key !== 'definitions') {
          collectDefinitions(obj[key], `${parentPath}.${key}`);
        }
      }
    };

    // Start collection from paths
    collectDefinitions(openapi.paths);

    // Add all collected definitions to components.schemas
    if (Object.keys(allDefinitions).length > 0) {
      openapi.components.schemas = {
        ...openapi.components.schemas,
        ...allDefinitions,
      };
      this.debug(
        `  ✓ Hoisted ${Object.keys(allDefinitions).length} type definitions to root level`
      );
    }

    // Now update all $refs to point to the root level
    const updateRefs = (obj: any) => {
      if (!obj || typeof obj !== 'object') {
        return;
      }

      if (obj.$ref && typeof obj.$ref === 'string') {
        // Convert local definition refs to component schema refs
        if (obj.$ref.startsWith('#/definitions/')) {
          const defName = obj.$ref.replace('#/definitions/', '');
          obj.$ref = `#/components/schemas/${defName}`;
        }
      }

      // Recursively update all properties
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          updateRefs(obj[key]);
        }
      }
    };

    updateRefs(openapi.paths);
    updateRefs(openapi.components.schemas);
  }

  private generateSummary(endpoint: ApiEndpoint): string {
    const resource = this.extractResourceName(endpoint.path);
    const action = this.getActionFromMethod(endpoint.method);

    return `${action} ${resource}`;
  }

  private extractResourceName(path: string): string {
    const cleanPath = this.normalizePath(path);
    const parts = cleanPath.split('/').filter((p) => p && !p.startsWith('{'));
    const resourcePart = parts[parts.length - 1];

    if (!resourcePart || resourcePart === 'api') {
      return 'resource';
    }

    return resourcePart.charAt(0).toUpperCase() + resourcePart.slice(1);
  }

  private getActionFromMethod(method: string): string {
    const actions: Record<string, string> = {
      GET: 'Get',
      POST: 'Create',
      PATCH: 'Update',
      PUT: 'Replace',
      DELETE: 'Delete',
    };
    return actions[method] || method;
  }

  private extractTags(path: string): string[] {
    const cleanPath = this.normalizePath(path);

    let apiTag = '';
    if (cleanPath.startsWith('/api2/')) {
      apiTag = 'api2';
    } else if (cleanPath.startsWith('/beta/')) {
      apiTag = 'beta';
    } else if (cleanPath.startsWith('/api/')) {
      apiTag = 'api';
    }

    return apiTag ? [apiTag] : ['General'];
  }

  private generateTags(): Array<{ name: string; description: string }> {
    const tagSet = new Set<string>();

    for (const endpoints of this.endpoints.values()) {
      for (const endpoint of endpoints) {
        const tags = this.extractTags(endpoint.path);
        tags.forEach((tag) => tagSet.add(tag));
      }
    }

    if (this.rpcEndpoints.length > 0) {
      tagSet.add('RPC');
    }

    const tagDescriptions: Record<string, string> = {
      api: 'API endpoints',
      api2: 'API2 endpoints',
      beta: 'Beta/experimental endpoints',
      RPC: 'Remote Procedure Call endpoints',
      General: 'General endpoints',
    };

    const sortedTags = Array.from(tagSet).sort((a, b) => {
      const order = ['api', 'api2', 'beta', 'RPC', 'General'];
      const aIndex = order.indexOf(a);
      const bIndex = order.indexOf(b);

      if (aIndex !== -1 && bIndex !== -1) {
        return aIndex - bIndex;
      }
      if (aIndex !== -1) {
        return -1;
      }
      if (bIndex !== -1) {
        return 1;
      }
      return a.localeCompare(b);
    });

    return sortedTags.map((tag) => ({
      name: tag,
      description: tagDescriptions[tag] || `${tag} related endpoints`,
    }));
  }

  private guessParamType(paramName: string): string {
    if (paramName.toLowerCase().includes('id')) {
      return 'integer';
    }
    if (paramName.toLowerCase() === 'recursive') {
      return 'boolean';
    }
    return 'string';
  }

  private getParamDescription(
    paramName: string,
    path: string
  ): string | undefined {
    const lower = paramName.toLowerCase();

    if (lower === 'pathname' && path.includes('breadcrumbs')) {
      return 'Route pathname with placeholders like /organize/[orgId]/projects. Pass placeholder values as separate query params (e.g., add &orgId=2 to the URL).';
    }
    if (lower === 'query' && path.includes('breadcrumbs')) {
      return 'Query parameters for the pathname (e.g., orgId=2)';
    }
    if (lower === 'filter' && path.includes('actions')) {
      return 'Filter expression to query events. Format: field>=value or field<=value. Example: start_time>=2025-12-11T10:00:00 filters events starting after that time.';
    }
    if (lower === 'recursive' && path.includes('actions')) {
      return 'Include events from sub-organizations. Set to true to include sub-org events, false (default) for current org only.';
    }
    // Pagination parameters
    if (lower === 'page') {
      return 'Page number for pagination (1-based). Use with "size" parameter to paginate through results.';
    }
    if (lower === 'size') {
      return 'Number of items per page. Common values: 10, 50, 100. Use with "page" parameter to paginate through results.';
    }
    if (lower === 'offset') {
      return 'Number of items to skip before starting to return results. Alternative to page-based pagination.';
    }
    if (lower === 'limit') {
      return 'Maximum number of items to return. Alternative to size parameter.';
    }

    return undefined;
  }

  private getExampleValue(paramName: string): string | number | boolean {
    const lowerParam = paramName.toLowerCase();

    const today = new Date();
    const dateStr = today.toISOString().split('T')[0];

    if (
      lowerParam === 'today' ||
      lowerParam === 'date' ||
      lowerParam === 'startdate' ||
      lowerParam === 'enddate' ||
      lowerParam === 'from' ||
      lowerParam === 'to' ||
      lowerParam === 'after' ||
      lowerParam === 'before' ||
      lowerParam.includes('date')
    ) {
      return dateStr;
    }

    if (lowerParam === 'pathname') {
      return '/organize/[orgId]/projects';
    }
    if (lowerParam === 'query') {
      return 'orgId=2';
    }
    if (lowerParam === 'filter') {
      return `start_time>=${dateStr}T00:00:00`;
    }
    if (lowerParam === 'recursive') {
      return true;
    }
    // Pagination parameters
    if (lowerParam === 'page') {
      return 1;
    }
    if (lowerParam === 'size') {
      return 50;
    }
    if (lowerParam === 'offset') {
      return 0;
    }
    if (lowerParam === 'limit') {
      return 50;
    }

    const exampleValues: Record<string, string | number> = {
      orgId: 2,
      personId: 2,
      userId: 2,
      projId: 281,
      campaignId: 281,
      projectId: 281,
      eventId: 544,
      surveyId: 170,
      taskId: 1,
      viewId: 1,
      emailId: 1,
      callId: 1,
      canvassId: 1,
      assignmentId: 73,
      callAssId: 145,
      canvassAssId: 1,
      areaId: 1,
      areaAssId: 73,
      locationId: 1,
      householdId: 1,
      submissionId: 1,
      folderId: 1,
      columnId: 1,
      tagId: 1,
      groupId: 1,
      roleId: 1,
      fileId: 1,
      journeyId: 1,
      instanceId: 1,
      milestoneId: 1,
    };

    for (const [key, value] of Object.entries(exampleValues)) {
      if (lowerParam === key.toLowerCase()) {
        return value;
      }
    }

    if (paramName.toLowerCase().includes('id')) {
      return 1;
    }

    return 'example';
  }

  public saveToFile(outputPath: string): void {
    const spec = this.generateOpenApi();
    const content = JSON.stringify(spec, null, 2);

    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(outputPath, content, 'utf-8');
    this.debug(`\nOpenAPI specification saved to: ${outputPath}`);
  }
}

async function main(debug: (...data: unknown[]) => void) {
  const args = process.argv.slice(2);
  const outputIndex = args.indexOf('--output');
  const outputPath =
    outputIndex !== -1 && args[outputIndex + 1]
      ? args[outputIndex + 1]
      : path.join(process.cwd(), 'public/openapi/openapi.json');

  debug('Zetkin OpenAPI Generator\n');
  debug(`Root directory: ${process.cwd()}`);
  debug(`Output file: ${outputPath}\n`);

  const generator = new OpenApiGenerator(process.cwd(), debug);

  await generator.parse();
  generator.printStats();
  generator.saveToFile(outputPath);

  debug('\n Done! You can now:');
  debug('  1. View the spec in Swagger UI: https://editor.swagger.io/');
  debug('  2. Import into Postman');
  debug('  3. Generate client SDKs using openapi-generator');
}

if (require.main === module) {
  // eslint-disable-next-line no-console
  main(console.log).catch(console.error);
}
