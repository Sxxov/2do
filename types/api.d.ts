declare type ApiAny<Data> = ApiOk<Data> | ApiErr;

declare type ApiOk<Data> = {
	ok: true,
	data: Data,
	redirect?: string,
}

declare type ApiErr<Code extends string = string> = {
	ok: false,
	error: {
		code: Code,
		field?: string,
		message?: string,
		detail?: string,
	},
	redirect?: string,
}