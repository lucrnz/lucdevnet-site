---
title: "Tale of my own deployment tool"
pubDate: "2023-01-31"
description: "The missing gear for my projects"
summary: "In this article I describe my experience building a deployment API tool from design to development."
coverImg: "/images/blog/deployment-tool/hero-image.webp"
coverAlt: "White rocket being launched"
tags: "devops, programming"
---

As the title says, I decided to write my program to make deploys to my services.

And I did it, this should be the first post being automatically deployed!

## Why do this in the first place?

Writing my service offers numerous benefits, including the opportunity for hands-on learning and increased familiarity with my systems and processes.

By taking on this project, I'll deepen my understanding of how deployment works and gain valuable skills that will hopefully make me a more proficient developer.

Additionally, having control over my API means that I can tailor it to my specific needs and requirements, allowing for greater efficiency and flexibility in my deployment process.

## First define what a deployment is

Software deployment is all of the activities that make a software system available for use.

That is a broad definition! it can mean anything, and then I realized that _yes_, in fact, It literally **is** anything that has to be done to achieve that goal.

The process of making a system available for use usually is divided into steps, and those steps hopefully represent some sort of command on a remote computer.

An array of commands will be run sequentially to make our service available.

## A glorified script runner

I need to store those commands as a parseable format in the `git` repository of the service the user is trying to deploy, then connect remotely to a shell on the target system, parse the commands file, change the working directory to the service folder and run those actions.

Example action definition file:

- An action to pull the latest code from the origin git repo, this can be GitHub for example.

- An action to build a container image and start it.

## Input and output

I did not play the REST game fairly, I did it in my own way because I could not find HTTP status codes or HTTP verbs to be relevant in this use-case.

Sure, when you try to authenticate and fail, you will get an unauthorized response.

For this I decided to be as simple as possible, use a pattern in the URL as parameters:

```bash
GET
/{machine}/{service}/{action_name}
```

How come you are GETTING an action? This does not make sense! Indeed, it doesn't, but so does put, posting, or patching.

If I wanted to make this restful, I would need to call this program a deployment queue runner, and make resources relevant to the deployment queue, for example, pushing an action to be run, or getting a log from a previously run action.

The output of my service is defined as a `JSON` document with the following structure:

```json
{
  "returncode": 0,
  "stdout": "Standard output contents",
  "stderr": "Standard error contents"
}
```

The status code is either `200` OK, or `500` Internal Server Error if the `returncode` is not zero.

## How it started

I started the project as a Python program, and using the `Flask` library I was able to create a working program.

I chose Python for this project because I wanted to start it as quickly as possible, without having to worry about boiler-plate, but that made it a bit slower.

I assumed the target machines are GNU/Linux computers running the [Bash](<https://en.wikipedia.org/wiki/Bash_(Unix_shell)>) shell, subsequently, the steps are commands for that shell.

When I got a minimally viable version of this program working, I decided to record a [little video of it](https://pony.social/@luc/109757107993667887) and send it to a few people.

Here are some testimonials of satisfied customers: _(Joking, they are just online friends, but hey sounds cooler this way, right?)_

> damn that's fucking awesome

_-- A pony on the internet_

> that is awesome!
>
> Deployment ✅

_-- An owl on the internet_

## Enter Go

The service does exactly what I planned, it runs `ssh` against the remote target to invoke a shell and feed commands via **standard input**. These commands are being read from a `yml` file that is placed in the same directory as the project.

All the commands are chained using the `&&` operator in bash, this defines a pipeline in a simple way.

In a moment of clarity, I realized that most service hosts that run CI/CD usually charge you by the run time of the pipeline. GitHub being an example that comes to my mind, so I decided it was time to let the trusty snake go.

After I got everything working, I took a break over the weekend, and between Sunday and Monday, I finished rewriting the program using the [Go programming language](https://go.dev).

## Conclusion

This idea gave me a topic to research, and ultimately a personal tool to complete my projects, and this means I can also be lazy when writing blog posts! because I don't need to think anymore of connecting to my server and doing the deployment manually.

So far it has been highly entertaining to develop it, and I encourage people to try to write their own remote procedures runner.

[View the project on GitHub!](https://github.com/lucrnz/mypli)

## Future ideas

Wouldn't it be cool If I didn't have to open a console to start cloning a project? Create a new endpoint for that.

Maybe re-introducing the program as a queue runner and making it restful?

A toy-front end for it? That would be fun!

Only the future will know.

Stay great.
