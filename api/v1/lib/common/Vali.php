<?php

namespace api\v1\lib\common;

use api\v1\lib\common\ResErr;
use api\v1\lib\common\ResErrCodes;
use api\v1\lib\common\ResOk;
use DateTime;

class Vali {
	public static $string;
	public static $int;
	public static $float;
	public static $bool;
	public static $array;
	public static $object;
	public static $null;
	public static $callable;
	public static $resource;
	public static $iterable;
	public static $numeric;
	public static $scalar;
	public static $countable;
	public static $finite;
	public static $infinite;
	public static $nan;
	public static $intish;
	public static $floatish;
	public static $boolish;
	public static $empty;
	public static $datetime;

	public static function check(mixed $obj, array $defs): ResOk|ResErr {
		$arr = (array) $obj;

		foreach ($defs as $key => $def) {
			$optional = false;
			if (gettype($key) === 'string' && $key[0] === '?') {
				$key = substr($key, 1);
				$optional = true;
			}

			if (!isset($arr[$key])) {
				if ($optional) {
					continue;
				}

				return new ResErr(
					ResErrCodes::INCOMPLETE,
					field: $key,
					detail: implode(', ', array_keys($arr)),
				);
			}

			if (is_array($def)) {
				$res = self::check($arr[$key], $def);
				if (!$res->ifOk()) {
					return $res;
				}
			}

			if (!$def($arr[$key])) {
				return new ResErr(ResErrCodes::INVALID, field: $key);
			}
		}

		return new ResOk([]);
	}

	public static function and(array ...$fns) {
		return function (mixed $obj) use ($fns) {
			foreach ($fns as $def) {
				if (!$def($obj)) {
					return false;
				}
			}

			return true;
		};
	}

	public static function or(array ...$defs) {
		return function (mixed $obj) use ($defs) {
			foreach ($defs as $def) {
				if (!$def($obj)) {
					return false;
				}
			}

			return true;
		};
	}

	public static function nullable(array $def) {
		return function (mixed $obj) use ($def) {
			if ($obj === null) {
				return true;
			}

			return $def($obj);
		};
	}

	public static function init() {
		self::$string ??= fn(mixed $v) => gettype($v) === 'string';
		self::$int ??= fn(mixed $v) => gettype($v) === 'integer';
		self::$float ??= fn(mixed $v) => gettype($v) === 'double';
		self::$bool ??= fn(mixed $v) => gettype($v) === 'boolean';
		self::$array ??= fn(mixed $v) => gettype($v) === 'array';
		self::$object ??= fn(mixed $v) => gettype($v) === 'object';
		self::$null ??= fn(mixed $v) => gettype($v) === 'NULL';
		self::$callable ??= fn(mixed $v) => is_callable($v);
		self::$resource ??= fn(mixed $v) => is_resource($v);
		self::$iterable ??= fn(mixed $v) => is_iterable($v);
		self::$numeric ??= fn(mixed $v) => is_numeric($v);
		self::$scalar ??= fn(mixed $v) => is_scalar($v);
		self::$countable ??= fn(mixed $v) => is_countable($v);
		self::$finite ??= fn(mixed $v) => is_finite($v);
		self::$infinite ??= fn(mixed $v) => is_infinite($v);
		self::$nan ??= fn(mixed $v) => is_nan($v);
		self::$intish ??= fn(mixed $v) => is_int($v) || is_numeric($v);
		self::$floatish ??= fn(mixed $v) => is_float($v) || is_numeric($v);
		self::$boolish ??= fn(mixed $v) => is_bool($v) || is_numeric($v);
		self::$empty ??= fn(mixed $v) => empty($v);
		self::$datetime ??= fn(mixed $v) => DateTime::createFromFormat(
			'Y-m-d H:i:s',
			$v,
		);
	}
}

Vali::init();
