<?php

namespace api\v1\lib\note;

use DateTime;

class Note {
	const ID_REGEX = '/^[a-zA-Z0-9-._]+$/';

	public string $id;
	public string $title;
	public string $owner;
	public string $description;
    public string $dateCreated;
    public string $dateModified;
    public string $peepeepoopoo;

	public function __construct(
		string $id,
		string $title,
		string $owner,
        string $description,
        string $dateCreated,
        string $dateModified,
		string $peepeepoopoo = 'peepeepoopoo',
	) {
		$this->id = $id;
		$this->title = $title;
		$this->owner = $owner;
        $this->description = $description;
        $this->dateCreated = $dateCreated;
        $this->dateModified = $dateModified;
		$this->peepeepoopoo = $peepeepoopoo;
	}

}