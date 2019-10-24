# Lab Setup Scripts

This folder contains scripts that lab administrators must run to setup the shared
infrastructure for the lab:

* *db-setup/* - provisions a PostgreSQL for attendees to use
* *amq-streams-setup* - creates AMQ Streams topics that the generator sends data to
* *iot-data-generator/* - provisions a service that simulates real-time traffic
and parking meter information
* A section below regarding CodeReady and GitHub Integration

## Requirements

* Node.js 10+
* npm 6+ (bundled with Node.js 10+)
* [OpenShift CLI(`oc`)](https://github.com/openshift/origin/releases/tag/v3.11.0)
* [jq CLI](https://stedolan.github.io/jq/)

## Setup

### Scripts

Start by creating the database, then AMQ Streams topics, and finally deploy the
IoT data generator.

```bash
# PostgreSQL setup for the db and tables with permissions and data
cd db-setup/
./db-setup.sh

# Create AMQ Streams topics 
cd amq-streams-setup/
oc apply -f topic-junctions.yaml
oc apply -f topic-meters.yaml

# IoT data generator setup
cd iot-data-generator/
npm install
npm run nodeshift
```

_*NOTE*: By default the IoT data is not placed on the AMQ Streams topics, but is instead logged to `stdout`. Set a `TRANSPORT_MODE=kafka` environment variable on the generator Deployment Config to start sending data to the AMQ Stream topics, e.g `oc set env dc/parking-and-junction-data-generator TRANSPORT_MODE=kafka -n city-of-losangeles`_

### Walkthrough Content
To load the Solution Pattern for lab/hackathon users, do the following:

1. Login as `admin` using `oc login -u admin`
1. Run `oc patch webapp tutorial-web-app-operator -n webapp --type=merge -p '{"spec":{"template":{"parameters":{"WALKTHROUGH_LOCATIONS":"https://github.com/evanshortiss/rhte-2019-hackathon-on-rhmi"}}}}'`


### GitHub OAuth Configuration for CodeReady
You will need to configure GitHub OAuth to enable integration between CodeReady
Workspaces and the GitHub Accounts of lab attendees. This is done by creating
an **OAuth application** on GitHub and linking it to the **Launcher SSO**
instance on the RHMI Cluster.

1. Run `oc get routes -n launcher | grep sso` and open the returned URL in your
web browser using https. This is the **Launcher SSO** dashboard login screen.
1. Login as the `admin` user using the password defined in the `SSO_ADMIN_PASSWORD` environment variable. You can get this quickly using the command: `oc get dc/launcher-sso -n launcher -o json | jq '.spec.template.spec.containers[0].env[] | select(.name == "SSO_ADMIN_PASSWORD")'`
1. Once logged in, choose **Identity Providers** from side navigation.
1. Select the **github** item in the displayed **Identity Providers** list.
1. Copy the **Redirect URI** displayed.
1. Create an [OAuth application on GitHub](https://github.com/settings/applications/new)
  1. Enter **RHMI Hackaton** as the **Application name**
  1. Enter the Solution Explorer URL for your RHMI Cluster in the **Homepage URL** field
  1. Paste the **Redirect URI** you just copied into the **Authorization callback URL** field
  1. Click **Register application**
  1. Copy the displayed **ClientID** and **Client Secret** into the corresponding fields in the **github identity provider** in the **Launcher SSO**.
  1. Scroll down and click *Save*.

You can verify GitHub integration is working by navigating to CodeReady
Workspaces and, creating a new workspace and choosing the GitHub import option.
