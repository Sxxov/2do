<?php

namespace api\v1\lib\common;

abstract class Res {
	abstract public function echo(): void;
	abstract public function __toString(): string;
	abstract public function ifOk(): ?self;
	abstract public function ifErr(): ?self;

	/** Echo & exit */
	public function return(): void {
		$this->echo();
		exit();
	}
}
