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

	public static function send(
		ResErrCodes $code,
		?string $field = null,
		?string $message = null,
		?string $detail = null,
		?string $redirect = null,
		?HttpCodes $http = HttpCodes::INTERNAL_SERVER_ERROR,
	) {
		http_response_code($http->value);
		$error = new ResErr($code, $field, $message, $detail, $redirect);
		echo $error;
	}

	public function __toString(): string {
		return json_encode([
			'ok' => false,
			'err' => $this,
		]);
	}
}
