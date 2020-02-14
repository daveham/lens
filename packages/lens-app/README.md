# lens: The Inference Lens - Manager App

This is a replacement of the lens-data-manager project. It is
based on create-react-app in order to move to current versions
of react/redux technology.

````
+----------+           +----------+               +----------+
|          |           |          |     data      |          |
|          | requests  |  REST    <--------------->  redis   |
|  client  +----------->   API    |     jobs      |          |
|          |           |          +--------------->  resque  |
|          |           |          |               |          |
+-----^----+           +---+------+               +-----+----+
      |                    |                            |
      |                    |                     worker |
      |                    v            +----------+    |
      |                                 |          |    |
      |                  files  <-------+   node-  <----+
      |   notifications                 |  resque  |
      +---------------------------------+  client  |
                                        |          |
                                        +----------+
````

* client: lens-app - dev port: 3000
* REST API: lens-api - dev port: 3001, dbg port: 5858
* node-resque client: lens-service - dev port: 3002, dbg port: 5859
