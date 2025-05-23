import { expect, test } from 'bun:test'
import { z } from 'zod'
import { zu } from '.'

const config = {
	required: (ctx) => 'required',
	invalid_type: (ctx) => 'invalid_type',
	too_small: (ctx) => 'too_small',
	too_big: (ctx) => 'too_big',
	invalid_string: (ctx) => 'invalid_string',
	not_multiple_of: (ctx) => 'not_multiple_of',
	not_finite: (ctx) => 'not_finite',
	invalid_enum_value: (ctx) => 'invalid_enum_value',
	invalid_union_discriminator: (ctx) => 'invalid_union_discriminator',
} satisfies Parameters<typeof zu.makeErrorMap>[0]

const errorMap = zu.makeErrorMap(config)

const errorCtxMock = {
	data: 'unknown',
	defaultError: 'Invalid',
	code: 'invalid_type',
	expected: 'unknown',
	received: 'unknown',
	path: [],
} satisfies zu.ErrorMapMessageBuilderContext<zu.ErrorCode>

test('z.string( { errorMap } )', () => {
	const schema = z.string({ errorMap }).min(3).max(5)

	expect(schema.safeParse('foo').data).toBe('foo')

	expect(schema.safeParse(undefined).error?.issues[0].message).toBe(
		config.required({
			...errorCtxMock,
			code: 'required',
			received: 'undefined',
		}),
	)

	expect(schema.safeParse(42).error?.issues[0].message).toBe(
		config.invalid_type(errorCtxMock),
	)

	expect(schema.safeParse(['foo']).error?.issues[0].message).toBe(
		config.invalid_type(errorCtxMock),
	)

	expect(schema.safeParse('ha').error?.issues[0].message).toBe(
		config.too_small({
			...errorCtxMock,
			code: 'too_small',
			type: 'string',
			inclusive: true,
			minimum: 3,
		}),
	)

	expect(schema.safeParse('hello world').error?.issues[0].message).toBe(
		config.too_big({
			...errorCtxMock,
			code: 'too_big',
			type: 'string',
			inclusive: true,
			maximum: 5,
		}),
	)
})

test('z.number( { errorMap } )', () => {
	const schema = z.number({ errorMap }).min(3).max(5)

	expect(schema.safeParse(3).data).toBe(3)

	expect(schema.safeParse(undefined).error?.issues[0].message).toBe(
		config.required({
			...errorCtxMock,
			code: 'required',
			received: 'undefined',
		}),
	)

	expect(schema.safeParse('foo').error?.issues[0].message).toBe(
		config.invalid_type(errorCtxMock),
	)

	expect(schema.safeParse([42]).error?.issues[0].message).toBe(
		config.invalid_type(errorCtxMock),
	)

	expect(schema.safeParse(2).error?.issues[0].message).toBe(
		config.too_small({
			...errorCtxMock,
			code: 'too_small',
			type: 'number',
			inclusive: true,
			minimum: 3,
		}),
	)

	expect(schema.safeParse(6).error?.issues[0].message).toBe(
		config.too_big({
			...errorCtxMock,
			code: 'too_big',
			type: 'number',
			inclusive: true,
			maximum: 5,
		}),
	)
})

test(`z.enum( [ 'foo', 'bar', 'baz' ], { errorMap } )`, () => {
	const schema = z.enum(['foo', 'bar', 'baz'], { errorMap })

	expect(schema.safeParse('foo').data).toBe('foo')

	expect(schema.safeParse(undefined).error?.issues[0].message).toBe(
		config.required({
			...errorCtxMock,
			code: 'required',
			received: 'undefined',
		}),
	)

	expect(schema.safeParse(42).error?.issues[0].message).toBe(
		config.invalid_type(errorCtxMock),
	)

	expect(schema.safeParse(['foo']).error?.issues[0].message).toBe(
		config.invalid_type(errorCtxMock),
	)
})

test('z.date( { errorMap } )', () => {
	const schema = z.date({ errorMap })

	const now = new Date()
	expect(schema.safeParse(now).data).toMatchObject(now)

	expect(schema.safeParse(undefined).error?.issues[0].message).toBe(
		config.required({
			...errorCtxMock,
			code: 'required',
			received: 'undefined',
		}),
	)

	expect(schema.safeParse('2023-01-13').error?.issues[0].message).toBe(
		config.invalid_type(errorCtxMock),
	)

	expect(schema.safeParse(null).error?.issues[0].message).toBe(
		config.invalid_type(errorCtxMock),
	)
})

test('README Example', () => {
	const config = {
		required: 'Custom required message',
		invalid_type: ({ data }) => `${data} is an invalid type`,
		too_big: ({ maximum }) => `Maximum length is ${maximum}`,
		invalid_enum_value: ({ data, options }) =>
			`${data} is not a valid enum value. Valid options: ${options?.join(' | ')} `,
	} satisfies Parameters<typeof zu.makeErrorMap>[0]

	const errorMap = zu.makeErrorMap(config)

	const maximum = 32
	const stringSchema = z.string({ errorMap }).max(maximum)

	expect(stringSchema.safeParse(undefined).error?.issues[0].message).toBe(
		config.required,
	)

	expect(stringSchema.safeParse(42).error?.issues[0].message).toBe(
		config.invalid_type({
			...errorCtxMock,
			data: 42,
		}),
	)

	expect(
		stringSchema.safeParse('this string is over the maximum length').error
			?.issues[0].message,
	).toBe(
		config.too_big({
			...errorCtxMock,
			code: 'too_big',
			type: 'string',
			maximum,
			inclusive: true,
		}),
	)

	const enumSchema = z.enum(['foo', 'bar'], { errorMap })

	expect(enumSchema.safeParse('baz').error?.issues[0].message).toBe(
		config.invalid_enum_value({
			...errorCtxMock,
			data: 'baz',
			code: 'invalid_enum_value',
			options: enumSchema.options,
		}),
	)
})
