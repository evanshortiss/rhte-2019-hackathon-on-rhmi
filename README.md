# RHTE 2019 Hackathon - RHMI (Integreatly)

This repository contains a Solution Pattern that's compatible with the
[Integreatly Solution Explorer](https://github.com/integr8ly/tutorial-web-app).

## Lab Setup
Refer to [content/README](content/README.md)

## Development Setup for Walkthrough Content

Setup requires installation of Node.js 10.15 or later. This enables a Git hook
that verifies the asciidoc content and walkthrough config.

```bash
git clone https://github.com/evanshortiss/rhte-2019-hackathon-on-rhmi

cd rhte-2019-hackathon-on-rhmi

npm install
```

## View Walkthrough Content Locally

When running the Solution Explorer (webapp) locally you lose certain features,
such as the injection of variables into asciidoc. Use local development to
quickly preview changes, but for testing deploy on an actual RHMI cluster.

```bash
# Clone the Solution Explorer
git clone https://github.com/integr8ly/tutorial-web-app

# Clone this lab in the same directory as the Solution Explorer
git clone https://github.com/evanshortiss/rhte-2019-hackathon-on-rhmi

# Set WALKTHROUGH_LOCATIONS variable the Solution Explorer needs
export WALKTHROUGH_LOCATIONS=$(pwd)/rhte-2019-hackathon-on-rhmi/walkthroughs

# Start the Solution Explorer at http://localhost:3006
cd tutorial-web-app
yarn install
yarn start:dev
```

## View Walkthrough Content on an RHMI Cluster

### Via OpenShift UI
1. Sign in as `admin` to the cluster.
1. Open the `Solution Explorer` project.
1. Navigate to `Resources > Other Resources` using the side menu.
1. Choose `Web App` in the dropdown.
1. Choose `Actions > Edit YAML` for `tutorial-web-app-operator` in the list.
1. Under `spec.template.parameters` (this block will also contain
`OPENSHIFT_HOST` and some other variables) add the following:

```yaml
WALKTHROUGH_LOCATIONS: 'https://github.com/integr8ly/tutorial-web-app-walkthroughs#v1.6.4,https://github.com/evanshortiss/rhte-2019-hackathon-on-rhmi.git'
```

### Via OpenShift CLI
1. Login as `admin` using `oc login -u admin`
1. Run `oc patch webapp tutorial-web-app-operator -n webapp --type=merge -p '{"spec":{"template":{"parameters":{"WALKTHROUGH_LOCATIONS":"https://github.com/evanshortiss/rhte-2019-hackathon-on-rhmi"}}}}'`
