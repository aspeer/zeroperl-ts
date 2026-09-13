# Asynchronous host functions

From the repository root, complete the [shared setup](../README.md#setup) once.
Then run:

```sh
bun examples/async-host-functions/main.ts
```

Expected output:

```text
Alice Example
Missing user handled
Alice Example
```

The local lookup waits 20 ms to simulate asynchronous I/O. Perl catches the rejected lookup and successfully calls JavaScript again afterwards. Change the local `users` map to try another result. No network, credentials or database are needed. Callback argument wrappers are borrowed until the callback settles; returned owned values transfer to Perl. Calls on the interpreter remain sequential.
