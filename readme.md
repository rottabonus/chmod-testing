## Resolution

- Following is expected behaviour, since root user should have rights to do anything, file permissions dont consider root-user

## What repo has

Includes a script that does following:
 - Create a directory  
 - Write a file to the directory
 - Change permissions to read-only for the directory
 - Check access to directory
 - Try to delete file from directory
 - Finally cleanup (change permissions back to write and remove directory)

### To test normally

Run

```sh
node test.js
```

You should see output like this
```sh
create dir
write file to dir
change permissions to read-only (4444):
check access:
no access! [Error: EACCES: permission denied, access 'foo'] {
  errno: -13,
  code: 'EACCES',
  syscall: 'access',
  path: 'foo'
}
error reading Error: Command failed: ls -l ./foo
ls: fts_read: Permission denied

    at ChildProcess.exithandler (node:child_process:419:12)
    at ChildProcess.emit (node:events:513:28)
    at maybeClose (node:internal/child_process:1091:16)
    at Socket.<anonymous> (node:internal/child_process:449:11)
    at Socket.emit (node:events:513:28)
    at Pipe.<anonymous> (node:net:322:12) {
  code: 1,
  killed: false,
  signal: null,
  cmd: 'ls -l ./foo'
}
total 0

try to delete file from folder
error [Error: EACCES: permission denied, lstat 'foo/bar'] {
  errno: -13,
  code: 'EACCES',
  syscall: 'lstat',
  path: 'foo/bar'
}
cannot remove, no permission
changed permission to write and deleted
done
```

### To test running with node-image that has root-user

build the image
```sh
docker build . -t chmod
```

run the image
```sh
docker run -it chmod
```

You will see now different output, as the permissions are never changed
```sh
create dir
write file to dir
change permissions to read-only (4444):
check access:
has access!
total 4
-rw-r--r-- 1 root root 3 Oct 25 09:10 bar

try to delete file from folder
deleted the dir
done
```


### To test running with node-image that has node-user

build the image
```sh
chmod % docker build -f ./Dockerfile.node . -t chmod-node
```

run the image
```sh
docker run -it chmod-node
```

You will see now correct output, as the permissions are changed as expected
```sh
create dir
write file to dir
change permissions to read-only (4444):
check access:
no access! [Error: EACCES: permission denied, access 'foo'] {
  errno: -13,
  code: 'EACCES',
  syscall: 'access',
  path: 'foo'
}
error reading Error: Command failed: ls -l ./foo
ls: cannot access './foo/bar': Permission denied

    at ChildProcess.exithandler (node:child_process:419:12)
    at ChildProcess.emit (node:events:513:28)
    at maybeClose (node:internal/child_process:1091:16)
    at ChildProcess._handle.onexit (node:internal/child_process:302:5) {
  code: 1,
  killed: false,
  signal: null,
  cmd: 'ls -l ./foo'
}
total 0
-????????? ? ? ? ?            ? bar

try to delete file from folder
error [Error: EACCES: permission denied, lstat 'foo/bar'] {
  errno: -13,
  code: 'EACCES',
  syscall: 'lstat',
  path: 'foo/bar'
}
cannot remove, no permission
changed permission to write and deleted
done
```
