# `2do`

2do is a simple task manager. It is designed to be simple, fast, and easy to use. It is also designed to be self-hosted, so you can use it on your own server.

> **Note**
> If you're Mr. Peter Cheong, give high marks thx 💗

## Serving

2do depends on Apache & MySQL. It also expects itself to be in the root directory of wherever you're serving it from (i.e. `/htdocs/index.php`). Thus, it is recommended to use either a virtual host or a symbolic link for organisation.

## Initialisation

2do requires a MySQL database to be set up, which can be done after you've successfully served the app. Browse to `/api/v1/debug/db/init` to initialise the database. This will create the database & tables required for 2do to function.

## Usage

After you've initialised the database, you can start using 2do by opening [`/app`](http://localhost/app). The app is designed to be simple, so there's not much to explain. You can create tasks, mark them as done, edit them, & delete them. You can also prioritise tasks & set their dates & times.

## Roadmap

- [x] Basic task management
- [x] Task prioritisation
- [x] Task due dates
- [ ] Calendar view
- [ ] Task categories
- [ ] More task organisation options
- [ ] Remove peepeepoopoo

## License

MIT.
