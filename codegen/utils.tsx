import { camelCase, merge, upperFirst } from 'lodash';
import * as ts from 'typescript';
import { OpenAPIReference, OpenAPISchema } from './openapi';
import * as tsx from './tsx';
import { Identifier } from './tsx';
tsx;

export function getIdentifierForSchemaName(name: string): ts.Identifier {
	return <Identifier text={upperFirst(camelCase(name))} />;
}

export function getIdentifierForSchemaRef(ref: string): ts.Identifier {
	const parts = ref.match(/^#\/components\/schemas\/([\w-]+)$/);
	if (!parts) {
		throw new Error(`Invalid reference in schema: ${ref}`);
	}
	const name = parts[1];
	return getIdentifierForSchemaName(name);
}

export function compressSchema(schema: OpenAPISchema | OpenAPIReference) {
	const { allOf, anyOf, oneOf } = schema as OpenAPISchema;
	if (anyOf || oneOf) {
		throw new Error('anyOf and oneOf in schema definition are not supported');
	}

	allOf?.forEach((item) => merge(schema, item));
}
