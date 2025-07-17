# Function to automate the AWS S3 search command
aws_upload() {
  # Prompt for inputs
  read -p "Enter the S3 bucket name: " bucket
  read -p "Enter the table name: " table
  read -p "Enter the partition date (p_date, e.g., 2024-12-03): " p_date
  read -p "Enter the identifier: " identifier

  # Validate inputs
  if [[ -z "$bucket" || -z "$table" || -z "$p_date" || -z "$identifier" ]]; then
    echo "Error: All inputs are required!"
    return 1
  fi

  # Construct the S3 path and command
  s3_path="s3://$bucket/$table/p_date=$p_date/"
  echo "Constructed S3 Path: $s3_path"

  # Execute the command and filter with grep
  echo "Running AWS S3 command..."
  aws s3 ls "$s3_path" --recursive | grep "$identifier"

  # Check for command success
  if [[ $? -eq 0 ]]; then
    echo "Command executed successfully."
  else
    echo "Error: No matching results found or an error occurred."
  fi
}
