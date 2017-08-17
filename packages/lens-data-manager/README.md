# lens: The Inference Lens - Data Manager


**Deprecated:** This package will be replaced by packages
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
