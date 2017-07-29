[Cozy][cozy] cozy-konnector-feeds
=================================

What's Cozy?
------------

![Cozy Logo](https://cdn.rawgit.com/cozy/cozy-guidelines/master/templates/cozy_logo_small.svg)

[Cozy] is a platform that brings all your web services in the same private space. With it, your webapps and your devices can share data easily, providing you with a new experience. You can install Cozy on your own hardware where no one's tracking you.

What's this new konnector?
--------------------------

This connector will fetch the a specific number of feeds from the list of feeds in io.cozy.feeds
doctype (ordered by update date)

### Open a Pull-Request

If you want to work on this konnector and submit code modifications, feel free to open pull-requests! See the [contributing guide][contribute] for more information about how to properly open pull-requests.

### Test the connector without an accessible cozy-stack

If you just want to test this connector without any cozy available.

You first need an installed [nodejs] (LTS version is fine).
Then just run :

```sh
npm install
npm start
```

The requests to the cozy-stack will be stubbed using the [./data/fixture.json] file as source of data
and when cozy-client is asked to create or update data, the data will be output to the console.
The bills (or any file) will be saved in the ./data directory.

### Run the connector linked to a cozy-stack

If you do not want to have to install the konnector on a cozy v3 to test it, you can register the
konnector as an OAuth application with the following commands :

```sh
npm install
npm run dev
```

This command will register your konnector as an OAuth application to the cozy-stack. By default,
the cozy-stack is supposed to be located in http://cozy.tools:8080. If this is not your case, just
update the COZY_URL field in [./konnector-dev-config.json]

After that, your konnector is running.


There is a cli command to register some feeds from an OPML file :

npm run init -- /path/to/your/opml/file.opml

Now run npm run dev one more time, you dont have to do the Oauth thing now, and it should be ok

### Hack

If you do not want to need to have an accessible cozy-stack, just run :

```sh
npm install
npm run standalone
```

The requests to the cozy stack will be stubbed using the [./fixture.json] file as source of data
if any and when cozy-client-js is asked to create or update data, the data will be output to the
console

### Maintainer

The lead maintainers for this konnector is @doubleface

### Get in touch

You can reach the Cozy Community by:

- Chatting with us on IRC [#cozycloud on Freenode][freenode]
- Posting on our [Forum]
- Posting issues on the [Github repos][github]
- Say Hi! on [Twitter]


License
-------

cozy-konnector-feeds is developed by @doubleface and distributed under the [AGPL v3 license][agpl-3.0].

[cozy]: https://cozy.io "Cozy Cloud"
[agpl-3.0]: https://www.gnu.org/licenses/agpl-3.0.html
[freenode]: http://webchat.freenode.net/?randomnick=1&channels=%23cozycloud&uio=d4
[forum]: https://forum.cozy.io/
[github]: https://github.com/cozy/
[nodejs]: https://nodejs.org/
[standard]: https://standardjs.com
[twitter]: https://twitter.com/mycozycloud
[webpack]: https://webpack.js.org
