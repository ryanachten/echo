# Variables replaced by values in `secrets.tfvar`
variable "heroku_email" {
  type = string
}

variable "heroku_api_key" {
  type = string
}

variable "heroku_app_name" {
  description = "Heroku app name (lower case letters, digits and dashes only)"
  type        = string
}