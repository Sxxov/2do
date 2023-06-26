<?php

namespace api\v1\lib\common;

class ResOk {
	public array $data;
	public ?string $redirect;

	public function __construct($data, ?string $redirect = null) {
		$this->data = (array) $data;

		if ($redirect) {
			$this->redirect = $redirect;
		}
	}

	public function echo() {
		http_response_code(200);
		echo $this;
	}

	public function __toString(): string {
		return json_encode([
			'ok' => true,
			'data' => $this->data,
			...isset($this->redirect) ? ['redirect' => $this->redirect] : [],
		]);
	}
}
