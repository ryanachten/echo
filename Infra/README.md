# echo - Infrastructure

Echo is hosted on Fly.io and uses Terraform for Infrastructure-as-Code.

## Setup

- Install `flyctl` [here](https://fly.io/docs/hands-on/install-flyctl/)
- Set `FLY_API_TOKEN` environment variable with personal access token from Fly.io
  - `$env:FLY_API_TOKEN="token-here"`
- Run `flyctl machines api-proxy` to start local proxy to Fly.io
- We can now run Terraform commands such as `terraform plan` and `terraform apply` to modify infrastructure
  - **Note**: `fly.toml` is used for continuous deployments by GtiHub actions. This needs to be synchronised with Terraform changes by running `flyctl config save -a echo-video`
