# lens: The Inference Lens

````
+----------+           +----------+               +----------+
|          |           |          |     data      |          |
|          | requests  |          <--------------->  redis   |
|  client  +----------->   mgr    |     jobs      |          |
|          |           |          +--------------->  resque  |
|          |           |          |               |          |
+-----^----+           +---+------+               +-----+----+
      |                    |                            |
      |                    |                     worker |
      |                    v            +----------+    |
      |                                 |          |    |
      |                  files  <-------+          <----+
      |   notifications                 |   svc    |
      +---------------------------------+          |
                                        |          |
                                        +----------+
````

* mgr (client): lens-app - dev port: 3000
* mgr (REST API): lens-api - dev port: 3001, dbg port: 5858
* svc: lens-service - dev port: 3002, dbg port: 5859
