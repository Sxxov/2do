<?php

namespace api\v1\lib\common;

class ResErr {
	public ResErrCodes $code;
	public ?string $field;
	public ?string $message;
	public ?string $detail;
	public ?string $redirect;

	public function __construct(
		ResErrCodes $code,
		?string $field = null,
		?string $message = null,
		?string $detail = null,
		?string $redirect = null,
	) {
		$this->code = $code;
		if ($field) {
			$this->field = $field;
		}
		if ($message) {
			$this->message = $message;
		}
		if ($detail) {
			$this->detail = $detail;
		}
		if ($redirect) {
			$this->redirect = $redirect;
		}
	}

	public function echo() {
		http_response_code($this->code->http()->value);
		echo $this;
	}

	public function __toString(): string {
		return json_encode([
			'ok' => false,
			'err' => [
				'code' => $this->code->key(),
				...isset($this->field) ? ['field' => $this->field] : [],
				...isset($this->message) ? ['message' => $this->message] : [],
				...isset($this->detail) ? ['detail' => $this->detail] : [],
				...isset($this->redirect)
					? ['redirect' => $this->redirect]
					: [],
			],
		]);
	}
}
