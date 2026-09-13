# Interpreter lifecycle

From the repository root, complete the [shared setup](../README.md#setup) once.
Then run:

```sh
bun examples/lifecycle/main.ts
```

Expected output:

```text
Released: object
Object cleanup finished
Released: after reset
Interpreter cleanup finished
```

Observe that each completion message follows the asynchronous release. The object wrapper is disposed before `reset()`, and the JavaScript callback is re-registered after reset. The example also awaits interpreter disposal. Increasing the callback delay makes the ordering more visible. This demonstrates cleanup mechanics; applications should still explicitly close resources during normal operation.

The manifest-matched runtime currently disables automatic `END` execution during
teardown; this example therefore does not use an `END` block for resource cleanup.
Use explicit cleanup while the interpreter is alive. Awaiting teardown remains
appropriate for runtimes and cleanup paths that can suspend.
