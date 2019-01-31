# Lens: The Inference Lens

[Project Documentation](https://daveham.github.io/lens/info/intro/overview)

[Style Guide](https://damp-everglades-77125.herokuapp.com)

Note: The Style Guide is running on a free Heroku dyno which may take a few minutes to wake up.

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
