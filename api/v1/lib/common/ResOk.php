<?php

namespace api\v1\lib\common;

class ResOk {
	public array $data;

	public function __construct($data) {
		$this->data = (array) $data;
	}

	public static function send($data) {
		http_response_code(200);
		$ok = new ResOk($data);
		echo $ok;
	}

	public function __toString(): string {
		return json_encode([
			'ok' => true,
			'data' => $this->data,
		]);
	}
}
