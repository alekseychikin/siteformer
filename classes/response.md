# SFResponse class

## `error`

Finishes runtime with error and message error

### Params

#### `$code`

Required.
HTTP code.

#### `$message`

Required.
Message with mixed data type. Could be array or string.

#### `$file`

Not required.
Path to file with error.

#### `$line`

Not required.
Line number.

#### `$stack`

Not required.
Array of stack call.

## `setStatus`

Set header with HTTP code and status

### `Params`

#### `$code`

Required.
HTTP code.

## `set`

Set some value to state.

### Params

#### `$field`

Required.
String of field name.

#### `$value`

Required.
Value with mixed type.

## `get`

Get value from state.

### Params

#### `$field`

Required.
String of field name.

## `getState`

Returns state.

## `render`

Makes output in html form, or json, or xml. It depends of `Accept` header.
It may be:
* `application/json` – JSON
* `text/xml` – XML
* `application/xml` – XML
* `application/xhtml+xml` – XML
* any else will returns html

## `redirect`

Sends header for redirection

### Params

#### `$path`

String with url

## `refresh`

Sends header for refresh page
