# lens: The Inference Lens

Moving to a monorepo. Not concerned with migrating commit history from other repos.


**Deprecated:** Package *lens-data-service* will be replaced by package 
*lens-service*.

**Deprecated:** Package *lens-data-manager* will be replaced by packages
*lens-app* and *lens-api*.


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
