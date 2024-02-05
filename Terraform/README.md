Using Terraform File to deploy Feature Flags to your LaunchDarkly Environment

Terraform file for setting up flags for the LD CORE DEMO.
You DON'T need to edit this file unless you're changing or creating default flag configurations. 

If you just want to run this file to create the flags, then:
1. Edit the .tfvars file to add your project key and an API access token. Example file is provided
2. Ensure that you have Terraform installed.
3. Run: terraform plan -var-file=".tfvars"
4. Assuming you got no errors from step 3, run: terraform apply -var-file=".tfvars"
5. Go check out your new flags!