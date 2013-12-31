# GI Bill Comparison Tool

- [View the site](http://department-of-veterans-affairs.github.io/gi-bill-comparison-tool/)
- [View the logic testing page](http://department-of-veterans-affairs.github.io/gi-bill-comparison-tool/logic_test.html)

# Building the Data API

To build the API used by the comparison tool, first place CSV data named `data.csv` in the [`_data/`](/_data) directory with the following headers in this order:

| facility_code | institution | city   | state  | country | bah     | poe     | yr      | gibill  | cross   | grad_rate | grad_rate_rank | default_rate | avg_stu_loan_debt | avg_stu_loan_debt_rank | indicator_group |
| ------------- | ----------- | ------ | ------ | ------- | ------- | ------- | ------- | ------- | ------- | --------- | -------------- | ------------ | ----------------- | ---------------------- | --------------- |
| String        | String      | String | String | String  | Integer | Boolean | Boolean | Integer | Integer | Float     | Integer        | Float        | Integer           | Integer                | Integer         |

Then run `$ rake build` to parse the CSV and build the JSON fragments that will populate the [`api/`](/api) directory.
