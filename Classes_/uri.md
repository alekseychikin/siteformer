# SFURI class

## `init`
Static constructor

### Params

#### `$path`

Required
String of request uri path

#### `$domain`

Not required
Request domain. It's going to be splited into array by dot
Default value is `$_SERVER['SERVER_NAME']`

#### `$port`

Not required
Request port.
Default value is `$_SERVER['SERVER_PORT']`

## `getUri`

Returns full URI of part of them

## `geUriItem`

Returns item of uri

### Params

If you send lack of parameters then it returns string of query.

### `$index`

Returns one part of path. Example:
```
SFURI::init('/one/two/three');
echo SFURI::getUriItem(1);
// output: two
```

## `getUriArray`

Returns array of parts

## `getUriLength`

Returns amount of parts

## `getDomain`

Returns full domain of part of it

### `Params`

If you send lack of parameters then it returns string of full domain

#### `$index`

Returns one part of domain. Example:

```
SFURI::init('/one/two/three', 'sub.domain.com.uk', '8080');
echo SFURI::getDomain(2);
// output: com
```

## `getDomainsLength`

Returns amount of domain parts

## `getPort`

Returns port
