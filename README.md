# GI Bill Comparison Tool

[View the site.](http://department-of-veterans-affairs.github.io/gi-bill-comparison-tool/)

Place CSV data named `data.csv` in the [`_data`](/data) dir with the following headers in this order:

| facility_code | institution | city   | state  | country | bah     | poe     | yr      | gibill  | cross   | grad_rate | grad_rate_rank | default_rate | avg_stu_loan_debt | avg_stu_loan_debt_rank | indicator_group |
| ------------- | ----------- | ------ | ------ | ------- | ------- | ------- | ------- | ------- | ------- | --------- | -------------- | ------------ | ----------------- | ---------------------- | --------------- |
| String        | String      | String | String | String  | Integer | Boolean | Boolean | Integer | Integer | Float     | Integer        | Float        | Integer           | Integer                | Integer         |
