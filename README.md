# Stress-O-Met
A Meteor stress testing tool.

## About 

The Stress-O-Met is a tool to generate load for Meteor applications. Eventually it will allow to generate different types of load in different components.
First, it will be able to insert MongoDB documents at a definable rate. In a second step it will be capable of calling Meteor methods on remote servers.

This tool is best used in combination with good monitoring in place, to observe possible effects of increased load.


## Functionality

* Connect to an external MongoDB
* Calculate operations per 10 seconds based on operations per minute, hour, or day

## Getting started

1. Clone the repo.
1. Change into the `app/` directory and run `$ meteor`
1. Enter a `mongourl` and a `Collection` name and hit the **Test Connection** button
1. ...
 
## Roadmap

* Perform stress testing for MongoDB with static doc
* Allow doc definition for MongoDB stress testing
* Connect to other Meteor servers using `DDP.connect()`
* Perform stress testing for Meteor methods on remote servers

## Known limitations

* Does not generate any load or induce stress. Yet.

## Changelog

no releases so far, pretend it does not exist.

### Meta

Created by [Stephan Hochhaus](https://github.com/yauh) (Twitter: [@yauh](https://twitter.com/yauh)).