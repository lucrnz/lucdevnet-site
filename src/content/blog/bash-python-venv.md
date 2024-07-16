---
title: "How to use a Python venv from a Bash script"
datePublished: "2023-01-26"
summary: "And an example building a simple API to show off"
metaDescription: "Learn how to use Python venv from a Bash script. You will also build an example API and configure systemd to run it."
image: "/images/blog/bash-python-venv/python-venv-hero-img.webp"
imageAlt: "Illustration showing the Bash logo and the Python logo"
tags: "python, bash"
---

> 💡 Info: This article assumes you have intermediate knowledge of Linux/Bash shell and Python.
>
> If you use the Windows operating system, please check out a guide on how to set up WSL2. This will not work otherwise!
>
> macOS users I am sorry, the part about systemd is not relevant, but you can follow along with the Python code.

## What is a venv?

Python virtual environments (venv) are isolated environments where you can install packages without affecting other projects.

This allows you to have different versions of packages for different projects, without them interfering with each other.

> ✏️ In a nutshell it bundles all your program libraries in a folder.

## Why use it from a script?

Let's say you are building an API. If you are not using a container or a [deterministic system](https://nixos.org), you might want to avoid using packages that could be outdated from your system's Python.

A way to do this is by using a `requirements.txt` file, in combination with venvs, which lets you choose specific versions of the packages you need.

To help integrate this api with the system, you might want to use a `systemd service` file.

## How ?

First, go to your project folder. I'll assume your virtual environment is in a folder called `.venv`.

Now create a file called `run.sh` and open it in your favorite text editor:

```bash
export PATH="$(pwd)/.venv/bin:$PATH"

python main.py
```

This will activate the `venv` and run the `main.py` script.

Hope you find this information useful! 🙌

## Bonus: Let's create a simple API and make systemd start it

> We are gonna make heavy usage of the command line, I assume you are prepared for this! 🪄

Make a folder for your project:

```
mkdir simple-api
```

Open the folder in your favorite code editor, and launch a `terminal` from it.

Let's get a `venv`

```
python3 -m venv .venv
source .venv/bin/activate
```

Add `flask`, the library we are gonna use to build this API

```
pip install flask
```

We will also add `gunicorn` a production-ready `appserver`

```
pip install gunicorn
```

Create a lockfile

```
pip freeze > requirements.txt
```

Create a `src` folder and your initial `main.py` file

```
mkdir src
touch src/main.py
```

> This is how the folder structure should look like:
>
> ![Folder structure](/images/blog/bash-python-venv/folder-structure.webp)

Let's start coding:

```python
from os import getenv
from flask import Flask, jsonify
from random import choice

app = Flask(__name__)

greetings = ["Hello", "Hola", "Bonjour", "Hallo", "こんにちは", "Hei", "Привіт"]

@app.route(f'/')
def index():
    return jsonify({'msg': choice(greetings)})

if __name__ == '__main__':
    app.run(host=getenv('HOST') or '127.0.0.1', port=getenv('PORT') or '5000')
```

Now, I will explain the code:

The imports are self-explanatory:

- Flask for listening to requests and replying to them
- `getenv` for reading the environment variables (that we later are gonna use for the port and the host)
- `choice` for choosing a random greeting from our list

This line initializes the library

```python
app = Flask(__name__)
```

Here we store multiple ways to say hello:

```python
greetings = ["Hello", "Hola", "Bonjour", "Hallo", "こんにちは", "Hei", "Привіт"]
```

This code says, hey: the following function is an `GET` route for the endpoint `/`

```python
@app.route(f'/')
def index():
```

Here we first choose a random item from our greeting list, then store it in a dictionary, and lastly return it as a `JSON` text.

Wow, that was a lot in just one line of code!

```python
    return jsonify({'msg': choice(greetings)})
```

Lastly, we run the `API` so we can listen to requests.

The if statement checks if we are running the script directly, it is needed for using production app servers like `gunicorn`.

The next line grabs the environment variables and provides some defaults to them.

Then we launch our program! 🚀

```python
    if __name__ == '__main__':
        app.run(host=getenv('HOST') or '::', port=getenv('PORT') or '5000')
```

Let's test it!

```
python main.py
```

Let's call it! Use another terminal

```
curl http://localhost:5000/
```

You should see this:

```json
{ "msg": "Hello" }
```

✨ It works! Nice

## Let's configure systemd

> For this I am gonna use `systemd` user services, if your server/`VPS` runs as root, you might want to consider creating a user for your projects.
>
> If you wanna proceed using default services, you can do so, just remove the `--user` flag from all the commands from here.

To make our program start automatically with the system we need to create a system-d unit.

But first, let's make a bash script for starting our API:

```
touch launch.sh
```

> Info: We are creating this file outside of the src directory.

```bash
export PATH="$(pwd)/.venv/bin:$PATH"

python -m gunicorn --chdir src main:app -w 4 --threads 2 -b [::]:5000
```

I will explain what happens in this script:

First, we set up the `PATH` variable so we can run Python from our `venv`, then the gunicorn module is executed, and this will launch the appserver.

The arguments make sure to change to the `src` directory and run on `4` workers with `2` threads each.

It also tells it to bind on all addresses, by using `[::]` on the port `5000`

You can test this by running the script.

> Before this, close your existing terminal if it already has a venv activated

```
./launch.sh
```

When you finish testing it, please close it by pressing `Ctrl+C` (or `Command+C`)

Let's set up the service unit:

```
mkdir -p ~/.config/systemd/user
cd ~/.config/systemd/user
touch simple-api.service
```

Open the file `simple-api.service` with your text/code editor:

```
[Unit]
Description=My flask API

[Service]
WorkingDirectory=/home/user/simple-api
ExecStart=bash launch.sh

[Install]
WantedBy=default.target
```

> ✅ You need to replace `/home/user/simple-api` with your project path.

Enable the unit:

```
systemctl --user daemon-reload
systemctl --user enable --now simple-api.service
```

Recommended for server/VPS (not your dev machine):

```
sudo loginctl enable-linger $(whoami)
```

This will make it so all your user's services will start even when you haven't logged in.

Let's try to call it!

```
curl http://localhost:5000/
```

```sh
{"msg":"Bonjour"}
```

Hope you enjoyed this article! Have a wonderful day! ☺️

## Reverting changes

> **Important** if you don't want this api taking the port `5000` forever!

Disable the service unit:

```
systemctl disable --user simple-api.service
```

Remove it:

```
rm ~/.config/systemd/user/simple-api.service
```

Delete the `simple-api` folder.
