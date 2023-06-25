<?php

namespace api\v1\lib\common;

class ResErr {
	public ResErrCodes $code;
	public ?string $field;
	public ?string $message;
	public ?string $detail;
	public ?string $redirect;

	public static function send(
		ResErrCodes $code,
		?string $field = null,
		?string $message = null,
		?string $detail = null,
		?string $redirect = null,
		?int $http = 500,
	) {
		http_response_code($http);
		$error = new ResErr();
		$error->code = $code;
		if ($field) {
			$error->field = $field;
		}
		if ($message) {
			$error->message = $message;
		}
		if ($detail) {
			$error->detail = $detail;
		}
		if ($redirect) {
			$error->redirect = $redirect;
		}
		echo $error;
	}

	public function __toString(): string {
		return json_encode([
			'ok' => false,
			'err' => $this,
		]);
	}
}
