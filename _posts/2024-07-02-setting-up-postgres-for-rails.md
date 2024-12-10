---
layout: post
title: Setting Up Postgres for Rails
---

If you are setting up a Rails application for development and you need to run Postgres locally, 
you have two options:
1. Install Postgres using the operating system package manager (e.g. `apt get`)
2. Start a PostgreSQL container

Installing locally is fairly trivial and involves just two commands:

```shell
sudo apt install postgresql
sudo systemctl enable postgresql
```

Once PostgreSQL is installed and running, you only need to create a Postgres role that matches 
your OS username and a default database since Postgres will raise a 
`FATAL:  database "<your_account_name>" does not exist` error unless you specify a database:

```shell
sudo -u postgres psql
```

and write the following SQL commands:

```sql
CREATE ROLE <your_account_name> WITH SUPERUSER LOGIN PASSWORD 'password';
CREATE DATABASE <your_account_name> OWNER <your_account_name>;
```

_Note: This approach also works in WSL2 since [September 2022, when Microsoft added support for Systemd][wsl-systemd]._

[wsl-systemd]: https://devblogs.microsoft.com/commandline/systemd-support-is-now-available-in-wsl/

The other option is to start a container:

```shell
sudo docker run -d \
  --restart unless-stopped \
  -p "127.0.0.1:5432:5432" \
  --name=postgres14 \
  -e POSTGRES_PASSWORD=password \
  postgres:14
```

If you have a vanilla `config/database.yml` file (e.g. after running `rails new your_app`), ActiveRecord will try 
to connect to the localhost using a socket instead of the exposed port, causing a `ActiveRecord::ConnectionNotEstablished` 
error because the Docker container only exposes a port.

However, if you set up the `PGHOST` environment variable to point to an IP address (in this case, `127.0.0.1`) 
then Postgres will use the `5432` port automatically, without having to edit the `config/database.yml` file:

```shell
export PGHOST=127.0.0.1
export PGUSER=postgres
export PGPASSWORD=password
```

As an alternative, you can create a `pgpass` file where you can store the password 
instead of using the `PGPASSWORD` environment variable.
