---
name: builder-framework
description: Use the Builder framework to generate Glue job scripts from YAML definitions
triggers:
  - "use builder"
  - "generate from yaml"
  - "silver layer job"
  - "create yaml definition"
---

# Builder Framework Skill

## Purpose

The Builder framework generates AWS Glue job Python scripts from YAML configuration files. It promotes code reuse through modular functions and consistent job structure.

## When to Use

- Creating new Silver layer transformation jobs
- Adding standardized data processing logic
- Reusing existing transformation functions
- Maintaining consistency across similar jobs

## Framework Structure

```
builder/
├── builder.py              # Main script generator
├── validator.py            # YAML validation
├── definitions/            # YAML job definitions
│   ├── silver-platform-bookings.yaml
│   ├── silver-platform-clients.yaml
│   └── silver-[source]-[table].yaml
└── functions/              # Reusable function modules
    ├── configure_spark_session/
    │   ├── function.py     # Function implementation
    │   └── metadata.yaml   # Dependencies and imports
    ├── check_table_columns/
    ├── process_table/
    ├── get_timedelta/
    ├── load_config/
    └── read_s3_file/
```

## Creating a YAML Definition

### File Naming Convention
```
builder/definitions/[level]-[source]-[table].yaml
```

Examples:
- `silver-platform-bookings.yaml`
- `silver-stripe-charges.yaml`
- `silver-zendesk-tickets.yaml`

### YAML Structure

```yaml
# Job metadata
service: aws-glue           # Always aws-glue
level: silver               # bronze, silver, or gold
source: platform            # Data source name
name: bookings              # Table name

# Functions to include in generated script
function_definitions:
  - name: load_config
  - name: check_table_columns
  - name: process_table
  - name: get_timedelta

# Optional: Additional imports
imports:
  - boto3
  - json

# Optional: Additional job arguments
config_args:
  - ", 'custom_param'"

# Main execution logic
function_calls: |
    # Configuration
    columns_to_drop = [
        "internal_field",
        "deprecated_column"
    ]

    start_date = get_timedelta(days=730)
    database_name = "data-glue-crawler"
    crawler_table = "platform_prod_indie_platform_public_bookings"
    table = "bookings"

    has_id, has_created_at = check_table_columns(database_name, crawler_table)

    if has_id and has_created_at:
        logger.info(f"[slv]-[plat]: Processing table: {table}")
        process_table(source_bucket, target_bucket, table, start_date, columns_to_drop)
    else:
        logger.info(f"[slv]-[plat]: Skipping table {table}")

    logger.info("[slv]-[plat]: Processing completed!")
```

## Creating a Reusable Function

### 1. Create Function Directory
```bash
mkdir -p builder/functions/my_function
```

### 2. Create function.py
```python
# builder/functions/my_function/function.py

def my_function(spark, table_name, **kwargs):
    """
    Brief description of what the function does.

    Args:
        spark: SparkSession instance
        table_name: Name of the table to process
        **kwargs: Additional parameters

    Returns:
        DataFrame: Processed data
    """
    logger.info(f"Processing {table_name}")

    # Implementation
    df = spark.read.format('delta').load(f"s3://{bucket}/{table_name}/")

    # Apply transformations
    df = df.filter(F.col("status").isNotNull())

    return df
```

### 3. Create metadata.yaml
```yaml
# builder/functions/my_function/metadata.yaml

name: my_function

# Other functions this depends on (will be included automatically)
dependencies:
  - helper_function

# Python imports required
imports:
  - boto3
  - json
```

## Running the Builder

```bash
cd data-engineering
python builder/builder.py
```

Output:
```
Successfully generated silver-platform-bookings.py.
Successfully generated silver-platform-clients.py.
```

Generated files appear in:
```
data-lake/aws-glue/silver/[source]/silver-[source]-[table].py
```

## Generated Script Structure

The builder produces scripts with this structure:

```python
# Auto-generated script
from pyspark.context import SparkContext
from pyspark.sql import functions as F
from pyspark.sql.window import Window
from awsglue.transforms import *
from awsglue.utils import getResolvedOptions
from awsglue.context import GlueContext
from awsglue.job import Job
import sys
import boto3  # From function imports

args = getResolvedOptions(sys.argv, ['JOB_NAME', 'source_bucket', 'target_bucket'])

# Initialize Glue context
sc = SparkContext()
glueContext = GlueContext(sc)
spark = glueContext.spark_session
job = Job(glueContext)
job.init(args['JOB_NAME'], args)

logger = glueContext.get_logger()

source_bucket = args['source_bucket']
target_bucket = args['target_bucket']

# [Extracted function definitions here]
def configure_spark_session(spark):
    ...

def process_table(source_bucket, target_bucket, table, start_date, columns_to_drop):
    ...

# [Main execution from function_calls]
if __name__ == '__main__':
    try:
        configure_spark_session(spark)
        # ... function_calls content ...
    except Exception as e:
        logger.error(f'Job failed: {str(e)}')
```

## Available Functions

| Function | Purpose |
|----------|---------|
| `configure_spark_session` | Set up Spark with Delta Lake and date handling |
| `check_table_columns` | Verify required columns exist in source |
| `process_table` | Standard table processing with incremental load |
| `get_timedelta` | Calculate date offsets for filtering |
| `load_config` | Load configuration from S3 |
| `read_s3_file` | Read files from S3 with format detection |

## Best Practices

1. **Reuse existing functions** - Check `builder/functions/` before writing new code
2. **Keep function_calls simple** - Complex logic should be in functions
3. **Use descriptive names** - `silver-platform-bookings.yaml` not `job1.yaml`
4. **Document dependencies** - List all required functions in metadata.yaml
5. **Test locally first** - Run builder.py to verify YAML is valid

## Troubleshooting

**YAML parsing error**:
```bash
python builder/validator.py definitions/my-definition.yaml
```

**Missing function**:
- Check function exists in `builder/functions/`
- Verify function name in `function_definitions` matches directory name

**Import error in generated script**:
- Add missing import to function's `metadata.yaml`
