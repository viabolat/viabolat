'''
new tester script (old script below)
'''

import boto3
import re
import logging
from botocore.exceptions import ClientError

# Initialize AWS clients
iam_client = boto3.client('iam')
logs_client = boto3.client('logs')
lambda_client = boto3.client('lambda')
events_client = boto3.client('events')

# Logging Configuration
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
)


# Parse error logs to extract resource names
def parse_error_logs(logs):
    """Parse error logs to extract resource names."""
    role_names = re.findall(r'Role with name ([\w-]+) already exists', logs)
    log_groups = re.findall(r'The specified log group already exists: (/[a-zA-Z0-9/_-]+)', logs)
    lambda_functions = re.findall(r'Function already exist: ([\w-]+)', logs)
    eventbridge_rules = re.findall(r'deleting EventBridge Rule \(([\w-]+)\): operation error', logs)
    iam_policies = re.findall(r'A policy called ([\w-]+) already exists', logs)
    return {
        "Roles": role_names,
        "Log Groups": log_groups,
        "Lambda Functions": lambda_functions,
        "EventBridge Rules": eventbridge_rules,
        "IAM Policies": iam_policies,
    }


# Deletion functions
def delete_inline_policies(role_name):
    """Delete inline policies for a given role."""
    try:
        policies = iam_client.list_role_policies(RoleName=role_name).get('PolicyNames', [])
        for policy in policies:
            iam_client.delete_role_policy(RoleName=role_name, PolicyName=policy)
        return True, f"Deleted inline policies for {role_name}"
    except Exception as e:
        return False, f"Failed to delete inline policies for {role_name}: {e}"


def detach_managed_policies(role_name):
    """Detach managed policies for a given role."""
    try:
        policies = iam_client.list_attached_role_policies(RoleName=role_name).get('AttachedPolicies', [])
        for policy in policies:
            iam_client.detach_role_policy(RoleName=role_name, PolicyArn=policy['PolicyArn'])
        return True, f"Detached managed policies for {role_name}"
    except Exception as e:
        return False, f"Failed to detach managed policies for {role_name}: {e}"


def delete_instance_profiles(role_name):
    """Remove role from instance profiles and delete profiles."""
    try:
        profiles = iam_client.list_instance_profiles_for_role(RoleName=role_name).get('InstanceProfiles', [])
        for profile in profiles:
            iam_client.remove_role_from_instance_profile(InstanceProfileName=profile['InstanceProfileName'],
                                                         RoleName=role_name)
            iam_client.delete_instance_profile(InstanceProfileName=profile['InstanceProfileName'])
        return True, f"Deleted instance profiles for {role_name}"
    except Exception as e:
        return False, f"Failed to delete instance profiles for {role_name}: {e}"


def delete_role(role_name):
    """Delete an IAM role."""
    results = []
    results.append(delete_inline_policies(role_name))
    results.append(detach_managed_policies(role_name))
    results.append(delete_instance_profiles(role_name))
    try:
        iam_client.delete_role(RoleName=role_name)
        results.append((True, f"Deleted role: {role_name}"))
    except Exception as e:
        results.append((False, f"Failed to delete role {role_name}: {e}"))
    return results


def delete_log_group(log_group_name):
    """Delete a CloudWatch log group."""
    try:
        logs_client.delete_log_group(logGroupName=log_group_name)
        return True, f"Deleted log group: {log_group_name}"
    except Exception as e:
        return False, f"Failed to delete log group {log_group_name}: {e}"


def delete_lambda_function(function_name):
    """Delete a Lambda function."""
    try:
        lambda_client.delete_function(FunctionName=function_name)
        return True, f"Deleted Lambda function: {function_name}"
    except Exception as e:
        return False, f"Failed to delete Lambda function {function_name}: {e}"


def delete_eventbridge_rule(rule_name):
    """Delete an EventBridge rule, removing its targets first."""
    try:
        targets_response = events_client.list_targets_by_rule(Rule=rule_name)
        targets = targets_response.get('Targets', [])
        if targets:
            target_ids = [target['Id'] for target in targets]
            events_client.remove_targets(Rule=rule_name, Ids=target_ids)
            logging.info(f"Removed targets for rule {rule_name}: {target_ids}")
        events_client.delete_rule(Name=rule_name)
        return True, f"Deleted EventBridge rule: {rule_name}"
    except events_client.exceptions.ResourceNotFoundException:
        return False, f"EventBridge rule {rule_name} does not exist."
    except Exception as e:
        return False, f"Failed to delete EventBridge rule {rule_name}: {e}"


def delete_iam_policy(policy_name):
    """Delete an IAM policy."""
    try:
        account_id = boto3.client('sts').get_caller_identity()['Account']
        policy_arn = f"arn:aws:iam::{account_id}:policy/{policy_name}"
        iam_client.delete_policy(PolicyArn=policy_arn)
        return True, f"Deleted IAM policy: {policy_name}"
    except iam_client.exceptions.NoSuchEntityException:
        return False, f"IAM policy {policy_name} does not exist."
    except Exception as e:
        return False, f"Failed to delete IAM policy {policy_name}: {e}"


# Verification function
def verify_deletion(role_names, log_groups, lambda_functions):
    """Verify if the resources have been deleted."""
    still_exists = []
    for role_name in role_names:
        try:
            iam_client.get_role(RoleName=role_name)
            still_exists.append(f"IAM Role: {role_name} - Still exists.")
        except iam_client.exceptions.NoSuchEntityException:
            pass
    for log_group in log_groups:
        try:
            logs_client.describe_log_groups(logGroupNamePrefix=log_group)
            still_exists.append(f"Log Group: {log_group} - Still exists.")
        except logs_client.exceptions.ResourceNotFoundException:
            pass
    for function_name in lambda_functions:
        try:
            lambda_client.get_function(FunctionName=function_name)
            still_exists.append(f"Lambda Function: {function_name} - Still exists.")
        except lambda_client.exceptions.ResourceNotFoundException:
            pass
    return still_exists


# Main function
def main():
    """Main function to parse logs and delete resources."""
    print("Paste the error log below (end with an empty line):")
    error_logs = ""
    while True:
        line = input()
        if not line.strip():
            break
        error_logs += line + "\n"

    parsed_results = parse_error_logs(error_logs)
    deletion_results = []

    # Process each resource type
    for role_name in parsed_results["Roles"]:
        deletion_results.extend(delete_role(role_name))
    for log_group in parsed_results["Log Groups"]:
        deletion_results.append(delete_log_group(log_group))
    for function_name in parsed_results["Lambda Functions"]:
        deletion_results.append(delete_lambda_function(function_name))
    for rule_name in parsed_results["EventBridge Rules"]:
        deletion_results.append(delete_eventbridge_rule(rule_name))
    for policy_name in parsed_results["IAM Policies"]:
        deletion_results.append(delete_iam_policy(policy_name))

    # Print results
    print("\n=== Deletion Results ===")
    for success, message in deletion_results:
        print(message)


if __name__ == "__main__":
    main()




'''
old script below (new tester script above)


import boto3
import re

# Initialize AWS clients
iam_client = boto3.client('iam')
logs_client = boto3.client('logs')
lambda_client = boto3.client('lambda')
events_client = boto3.client('events') 


def parse_error_logs(logs):
    """Parse error logs to extract resource names."""
    role_names = re.findall(r'Role with name ([\w-]+) already exists', logs)
    log_groups = re.findall(r'The specified log group already exists: (/[a-zA-Z0-9/_-]+)', logs)
    lambda_functions = re.findall(r'Function already exist: ([\w-]+)', logs)
    eventbridge_rules = re.findall(r'deleting EventBridge Rule \(([\w-]+)\): operation error', logs)
    return {
        "Roles": role_names,
        "Log Groups": log_groups,
        "Lambda Functions": lambda_functions,
        "EventBridge Rules": eventbridge_rules,
    }


def delete_inline_policies(role_name):
    """Delete inline policies for a given role."""
    try:
        policies = iam_client.list_role_policies(RoleName=role_name).get('PolicyNames', [])
        for policy in policies:
            iam_client.delete_role_policy(RoleName=role_name, PolicyName=policy)
        return True, f"Deleted inline policies for {role_name}"
    except Exception as e:
        return False, f"Failed to delete inline policies for {role_name}: {e}"


def detach_managed_policies(role_name):
    """Detach managed policies for a given role."""
    try:
        policies = iam_client.list_attached_role_policies(RoleName=role_name).get('AttachedPolicies', [])
        for policy in policies:
            iam_client.detach_role_policy(RoleName=role_name, PolicyArn=policy['PolicyArn'])
        return True, f"Detached managed policies for {role_name}"
    except Exception as e:
        return False, f"Failed to detach managed policies for {role_name}: {e}"


def delete_instance_profiles(role_name):
    """Remove role from instance profiles and delete profiles."""
    try:
        profiles = iam_client.list_instance_profiles_for_role(RoleName=role_name).get('InstanceProfiles', [])
        for profile in profiles:
            iam_client.remove_role_from_instance_profile(InstanceProfileName=profile['InstanceProfileName'],
                                                         RoleName=role_name)
            iam_client.delete_instance_profile(InstanceProfileName=profile['InstanceProfileName'])
        return True, f"Deleted instance profiles for {role_name}"
    except Exception as e:
        return False, f"Failed to delete instance profiles for {role_name}: {e}"


def delete_role(role_name):
    """Delete an IAM role."""
    results = []
    # Step-by-step deletion
    results.append(delete_inline_policies(role_name))
    results.append(detach_managed_policies(role_name))
    results.append(delete_instance_profiles(role_name))
    try:
        iam_client.delete_role(RoleName=role_name)
        results.append((True, f"Deleted role: {role_name}"))
    except Exception as e:
        results.append((False, f"Failed to delete role {role_name}: {e}"))
    return results


def delete_log_group(log_group_name):
    """Delete a CloudWatch log group."""
    try:
        logs_client.delete_log_group(logGroupName=log_group_name)
        return True, f"Deleted log group: {log_group_name}"
    except Exception as e:
        return False, f"Failed to delete log group {log_group_name}: {e}"


def delete_lambda_function(function_name):
    """Delete a Lambda function."""
    try:
        lambda_client.delete_function(FunctionName=function_name)
        return True, f"Deleted Lambda function: {function_name}"
    except Exception as e:
        return False, f"Failed to delete Lambda function {function_name}: {e}"


def delete_eventbridge_rule(rule_name):
    """Delete an EventBridge rule, removing its targets first."""
    try:
        # List targets by rule
        targets_response = events_client.list_targets_by_rule(Rule=rule_name)
        targets = targets_response.get('Targets', [])

        if targets:
            # Remove targets if any exist
            target_ids = [target['Id'] for target in targets]
            events_client.remove_targets(Rule=rule_name, Ids=target_ids)
            print(f"Removed targets for rule {rule_name}: {target_ids}")

        # Delete the rule
        events_client.delete_rule(Name=rule_name)
        return True, f"Deleted EventBridge rule: {rule_name}"
    except events_client.exceptions.ResourceNotFoundException:
        return False, f"EventBridge rule {rule_name} does not exist."
    except Exception as e:
        return False, f"Failed to delete EventBridge rule {rule_name}: {e}"


def verify_deletion(role_names, log_groups, lambda_functions):
    """Verify if the resources have been deleted."""
    still_exists = []
    for role_name in role_names:
        try:
            iam_client.get_role(RoleName=role_name)
            still_exists.append(f"IAM Role: {role_name} - Still exists.")
        except iam_client.exceptions.NoSuchEntityException:
            pass

    for log_group in log_groups:
        try:
            logs_client.describe_log_groups(logGroupNamePrefix=log_group)
            still_exists.append(f"Log Group: {log_group} - Still exists.")
        except logs_client.exceptions.ResourceNotFoundException:
            pass

    for function_name in lambda_functions:
        try:
            lambda_client.get_function(FunctionName=function_name)
            still_exists.append(f"Lambda Function: {function_name} - Still exists.")
        except lambda_client.exceptions.ResourceNotFoundException:
            pass

    return still_exists


def main():
    """Main function to parse logs and delete resources."""
    # Input error logs
    print("Paste the error log below (end with an empty line):")
    error_logs = ""
    while True:
        line = input()
        if not line.strip():
            break
        error_logs += line + "\n"

    # Parse error logs
    parsed_results = parse_error_logs(error_logs)
    role_names = parsed_results["Roles"]
    log_groups = parsed_results["Log Groups"]
    lambda_functions = parsed_results["Lambda Functions"]
    eventbridge_rules = parsed_results["EventBridge Rules"]

    deletion_results = []

    # Process IAM roles
    for role_name in role_names:
        deletion_results.extend(delete_role(role_name))

    # Process log groups
    for log_group in log_groups:
        deletion_results.append(delete_log_group(log_group))

    # Process Lambda functions
    for function_name in lambda_functions:
        deletion_results.append(delete_lambda_function(function_name))

    # Process EventBridge rules
    for rule_name in eventbridge_rules:
        deletion_results.append(delete_eventbridge_rule(rule_name))

    # Print deletion results
    print("\n=== Deletion Results ===")
    for success, message in deletion_results:
        print(message)


if __name__ == "__main__":
    main()


'''

